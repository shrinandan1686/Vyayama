const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');
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

const { generateWorkoutPlan } = require('../services/aiService');
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
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
