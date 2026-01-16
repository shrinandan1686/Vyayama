const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');
const Activity = require('../models/Activity');
const auth = require('../middleware/authMiddleware');

// @route   GET api/workout-plans
// @desc    Get current user's workout plan
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find the most recent plan for the user
        const plan = await WorkoutPlan.findOne({ user: req.user.id }).sort({ startDate: -1 }).populate({
            path: 'days.exercises.exercise',
            populate: { path: 'alternatives' }
        });
        if (!plan) return res.status(404).json({ msg: 'No workout plan found' });
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const { generateWorkoutPlan, generateNextDay } = require('../services/aiService');
const User = require('../models/User');

// ...

// @route   POST api/workout-plans
// @desc    Create a new workout plan (Triggered by user or auto)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Map user profile to AI Service expectation (snake_case for Python pydantic)
        const aiProfile = {
            age: user.fitnessProfile.age || 25,
            gender: user.fitnessProfile.gender || 'Prefer not to say',
            weight: user.fitnessProfile.weight || 70,
            height: user.fitnessProfile.height || 175,
            goal: user.fitnessProfile.goal || 'General Fitness',
            experience_level: user.fitnessProfile.experienceLevel || 'Beginner',
            gym_comfort: user.fitnessProfile.gymComfort,
            gym_confidence: user.fitnessProfile.gymConfidence,
            body_type: user.fitnessProfile.bodyType,
            focus_areas: user.fitnessProfile.focusAreas || [],
            days_per_week: user.fitnessProfile.daysPerWeek || 3,
            average_workout_duration: user.fitnessProfile.averageWorkoutDuration || 60,
            equipment: user.fitnessProfile.equipment || [],
            gym_crowd_level: user.fitnessProfile.gymCrowdLevel,
            injuries: user.fitnessProfile.injuries || []
        };

        // Call AI Service
        // AI returns: { planDurationDays, days: [ { dayNumber, workoutFocus, estimatedTimeMinutes, exercises: [...] } ] }
        const aiResponse = await generateWorkoutPlan(aiProfile); // Ensure this returns the full object now

        const Exercise = require('../models/Exercise');

        // Helper to find or create exercises and their alternatives
        const syncExercise = async (exData) => {
            let exercise = await Exercise.findOne({ name: exData.name });

            // Resolve alternatives first (recursive-ish, but usually 1 level deep)
            let alternativeIds = [];
            if (exData.alternatives && exData.alternatives.length > 0) {
                for (const alt of exData.alternatives) {
                    const altId = await syncExercise(alt); // Recursively sync alternatives
                    if (altId) alternativeIds.push(altId);
                }
            }

            if (!exercise) {
                exercise = new Exercise({
                    name: exData.name,
                    category: 'General', // Default, AI could provide this too
                    primaryMuscle: exData.primaryMuscle || 'Full Body',
                    secondaryMuscles: exData.secondaryMuscles || [],
                    equipment: exData.equipment && exData.equipment.length > 0 ? (Array.isArray(exData.equipment) ? exData.equipment[0] : exData.equipment) : 'None',
                    difficulty: 'Beginner', // Default
                    instructions: exData.instructions || [],
                    youtubeUrl: exData.youtubeUrl,
                    alternatives: alternativeIds
                });
                await exercise.save();
            } else {
                // Update missing fields if necessary (e.g., youtubeUrl)
                let updated = false;
                if (exData.youtubeUrl && !exercise.youtubeUrl) {
                    exercise.youtubeUrl = exData.youtubeUrl;
                    updated = true;
                }
                if (alternativeIds.length > 0 && (!exercise.alternatives || exercise.alternatives.length === 0)) {
                    exercise.alternatives = alternativeIds;
                    updated = true;
                }
                if (updated) await exercise.save();
            }
            return exercise._id;
        };

        // Process all days
        const processedDays = await Promise.all(aiResponse.days.map(async (day) => {
            const processedExercises = await Promise.all(day.exercises.map(async (ex) => {
                const exerciseId = await syncExercise(ex);
                return {
                    exercise: exerciseId,
                    sets: ex.sets,
                    reps: ex.reps.toString(), // Ensure string
                    completed: false,
                    skipped: false,
                    alternativeUsed: false
                };
            }));

            return {
                dayNumber: day.dayNumber,
                type: day.workoutFocus, // Map 'workoutFocus' to 'type'
                exercises: processedExercises,
                completed: false
            };
        }));

        const newPlan = new WorkoutPlan({
            user: req.user.id,
            startDate: new Date(),
            days: processedDays
        });

        const plan = await newPlan.save();
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        let errorMsg = 'Server error: ' + err.message;
        if (err.response && err.response.data) {
            errorMsg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
            if (err.response.data.detail) errorMsg = err.response.data.detail;
        }
        res.status(500).send(errorMsg);
    }
});

// @route   PUT api/workout-plans/:id/day/:dayNumber/exercise/:exerciseId
// @desc    Update exercise status (completed, skipped, etc.)
// @access  Private
router.put('/:id/day/:dayNumber/exercise/:exerciseId', auth, async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ msg: 'Plan not found' });

        // Make sure user owns the plan
        if (plan.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const day = plan.days.find(d => d.dayNumber === parseInt(req.params.dayNumber));
        if (!day) return res.status(404).json({ msg: 'Day not found' });

        const exercise = day.exercises.find(e => e.exercise.toString() === req.params.exerciseId || e._id.toString() === req.params.exerciseId);
        if (!exercise) return res.status(404).json({ msg: 'Exercise not found in plan' });

        const { completed, skipped, alternativeUsed } = req.body;
        if (completed !== undefined) exercise.completed = completed;
        if (skipped !== undefined) exercise.skipped = skipped;
        if (alternativeUsed !== undefined) exercise.alternativeUsed = alternativeUsed;

        await plan.save();

        // --- AUTOMATIC ACTIVITY LOGGING ---
        if (completed) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find or create activity for today
            let activity = await Activity.findOne({
                userId: req.user.id,
                workoutDate: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            if (!activity) {
                activity = new Activity({
                    userId: req.user.id,
                    planId: plan._id,
                    dayNumber: day.dayNumber,
                    workoutDate: new Date(),
                    caloriesBurned: 0,
                    duration: 0,
                    exercises: []
                });
            }

            // Check if this exercise is already in the activity
            const exerciseIndex = activity.exercises.findIndex(e => e.exerciseId.toString() === req.params.exerciseId);

            if (exerciseIndex === -1) {
                // Add to activity exercises
                const exDetails = day.exercises.find(e => e.exercise.toString() === req.params.exerciseId || e._id.toString() === req.params.exerciseId);

                activity.exercises.push({
                    exerciseId: req.params.exerciseId,
                    name: exDetails?.exercise?.name || 'Exercise',
                    sets: exDetails?.sets || 0,
                    reps: parseInt(exDetails?.reps) || 0,
                    completed: true
                });

                // Update totals (simplistic calculation: 50 calories per exercise)
                activity.caloriesBurned += 50;
                activity.duration += 10;
            }

            await activity.save();
        }
        // --- END ACTIVITY LOGGING ---

        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/workout-plans/next-day
// @desc    Generate and add the next day to the workout plan
// @access  Private
router.post('/next-day', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Get current workout plan
        const plan = await WorkoutPlan.findOne({ user: req.user.id }).sort({ startDate: -1 });
        if (!plan) return res.status(404).json({ msg: 'No workout plan found' });

        // Determine next day number
        const currentDay = user.currentWorkoutDay || 1;
        const nextDayNumber = currentDay + 1;

        // Check if day already exists
        const existingDay = plan.days.find(d => d.dayNumber === nextDayNumber);
        if (existingDay) {
            return res.json({ message: 'Day already exists', plan });
        }

        // Get previous workout focus for context
        const previousDay = plan.days.find(d => d.dayNumber === currentDay);
        const previousWorkoutFocus = previousDay ? previousDay.type : null;

        // Map user profile for AI
        const aiProfile = {
            age: user.fitnessProfile.age || 25,
            gender: user.fitnessProfile.gender || 'Prefer not to say',
            weight: user.fitnessProfile.weight || 70,
            height: user.fitnessProfile.height || 175,
            goal: user.fitnessProfile.goal || 'General Fitness',
            experience_level: user.fitnessProfile.experienceLevel || 'Beginner',
            gym_comfort: user.fitnessProfile.gymComfort,
            gym_confidence: user.fitnessProfile.gymConfidence,
            body_type: user.fitnessProfile.bodyType,
            focus_areas: user.fitnessProfile.focusAreas || [],
            days_per_week: user.fitnessProfile.daysPerWeek || 3,
            average_workout_duration: user.fitnessProfile.averageWorkoutDuration || 60,
            equipment: user.fitnessProfile.equipment || [],
            gym_crowd_level: user.fitnessProfile.gymCrowdLevel,
            injuries: user.fitnessProfile.injuries || []
        };

        // Generate next day using AI
        console.log(`Generating Day ${nextDayNumber} for user ${req.user.id}`);
        const aiDayResponse = await generateNextDay(aiProfile, nextDayNumber, previousWorkoutFocus);

        const Exercise = require('../models/Exercise');

        // Helper to sync exercises (same as in POST /)
        const syncExercise = async (exData) => {
            let exercise = await Exercise.findOne({ name: exData.name });
            let alternativeIds = [];

            if (exData.alternatives && exData.alternatives.length > 0) {
                for (const alt of exData.alternatives) {
                    const altId = await syncExercise(alt);
                    if (altId) alternativeIds.push(altId);
                }
            }

            if (!exercise) {
                exercise = new Exercise({
                    name: exData.name,
                    category: 'General',
                    primaryMuscle: exData.primaryMuscle || 'Full Body',
                    secondaryMuscles: exData.secondaryMuscles || [],
                    equipment: exData.equipment || [],
                    instructions: exData.instructions || [],
                    youtubeUrl: exData.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(exData.name)}`,
                    difficulty: user.fitnessProfile.experienceLevel || 'Beginner',
                    alternatives: alternativeIds
                });
                await exercise.save();
            }
            return exercise._id;
        };

        // Process exercises
        const dayExercises = [];
        for (const ex of aiDayResponse.exercises || []) {
            const exerciseId = await syncExercise(ex);
            dayExercises.push({
                exercise: exerciseId,
                sets: ex.sets || 3,
                reps: ex.reps || '10-12',
                completed: false
            });
        }

        // Add new day to plan
        plan.days.push({
            dayNumber: nextDayNumber,
            type: aiDayResponse.workoutFocus || 'Mixed',
            exercises: dayExercises
        });

        await plan.save();

        // Populate and return
        const updatedPlan = await WorkoutPlan.findById(plan._id).populate({
            path: 'days.exercises.exercise',
            populate: { path: 'alternatives' }
        });

        console.log(`Successfully generated and added Day ${nextDayNumber}`);
        res.json(updatedPlan);
    } catch (err) {
        console.error('Error generating next day:', err.message);
        res.status(500).json({ msg: 'Server error generating next day', error: err.message });
    }
});

module.exports = router;
