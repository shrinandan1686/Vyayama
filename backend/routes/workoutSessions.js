const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const WorkoutSession = require('../models/WorkoutSession');
const WorkoutTemplate = require('../models/WorkoutTemplate');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const { getScheduledWorkout, getUpcomingWorkout } = require('../utils/workoutSchedule');

// @route   GET api/workout-sessions/today
// @desc    Get today's scheduled workout (A/B) based on the fixed rotation
// @access  Private
router.get('/today', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const anchorDate = user.planStartDate || user.createdAt || new Date();
        const workoutType = getScheduledWorkout(anchorDate, new Date());

        if (!workoutType) {
            const upcoming = getUpcomingWorkout(anchorDate, new Date());
            let upcomingTemplate = null;
            if (upcoming) {
                upcomingTemplate = await WorkoutTemplate.findOne({ key: upcoming.workoutType }).populate('exercises.exercise');
            }
            return res.json({
                workoutType: null,
                template: null,
                upcoming: upcoming ? { ...upcoming, template: upcomingTemplate } : null
            });
        }

        const template = await WorkoutTemplate.findOne({ key: workoutType }).populate('exercises.exercise');
        if (!template) {
            return res.status(404).json({ msg: `Workout template ${workoutType} not found` });
        }

        res.json({ workoutType, template, upcoming: null });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/workout-sessions
// @desc    Start a new workout session from a template
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { workoutType } = req.body;
        if (!['A', 'B'].includes(workoutType)) {
            return res.status(400).json({ msg: 'workoutType must be A or B' });
        }

        const template = await WorkoutTemplate.findOne({ key: workoutType }).populate('exercises.exercise');
        if (!template) return res.status(404).json({ msg: `Workout template ${workoutType} not found` });

        const session = new WorkoutSession({
            user: req.user.id,
            workoutType,
            templateName: template.name,
            exercises: template.exercises.map((te) => ({
                exercise: te.exercise._id,
                targetSets: te.sets,
                targetRepsMin: te.targetRepsMin,
                targetRepsMax: te.targetRepsMax,
                restSeconds: te.restSeconds,
                sets: Array.from({ length: te.sets }, (_, i) => ({
                    setNumber: i + 1,
                    weight: null,
                    reps: null,
                    notes: '',
                    completed: false
                }))
            }))
        });

        await session.save();
        const populated = await WorkoutSession.findById(session._id).populate('exercises.exercise');
        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/workout-sessions/:id/set
// @desc    Log weight/reps/notes/completed for one set
// @access  Private
router.put('/:id/set', auth, async (req, res) => {
    try {
        const { exerciseIndex, setIndex, weight, reps, notes, completed } = req.body;

        const session = await WorkoutSession.findById(req.params.id);
        if (!session) return res.status(404).json({ msg: 'Session not found' });
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const exercise = session.exercises[exerciseIndex];
        if (!exercise) return res.status(404).json({ msg: 'Exercise not found in session' });

        const set = exercise.sets[setIndex];
        if (!set) return res.status(404).json({ msg: 'Set not found in exercise' });

        if (weight !== undefined) set.weight = weight;
        if (reps !== undefined) set.reps = reps;
        if (notes !== undefined) set.notes = notes;
        if (completed !== undefined) set.completed = completed;

        await session.save();
        const populated = await WorkoutSession.findById(session._id).populate('exercises.exercise');
        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/workout-sessions/:id/complete
// @desc    Finalize a session: compute aggregates + personal records
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.id);
        if (!session) return res.status(404).json({ msg: 'Session not found' });
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        let totalSets = 0;
        let totalReps = 0;
        let volumeLifted = 0;

        for (const ex of session.exercises) {
            for (const set of ex.sets) {
                if (set.completed) {
                    totalSets += 1;
                    totalReps += set.reps || 0;
                    volumeLifted += (set.weight || 0) * (set.reps || 0);
                }
            }
        }

        // Personal records: heaviest completed set per exercise, vs. this user's
        // prior completed sessions for that same exercise.
        const personalRecords = [];
        for (const ex of session.exercises) {
            const bestSet = ex.sets
                .filter((s) => s.completed && s.weight)
                .sort((a, b) => b.weight - a.weight)[0];
            if (!bestSet) continue;

            const priorBest = await WorkoutSession.aggregate([
                { $match: { user: session.user, status: 'completed', _id: { $ne: session._id } } },
                { $unwind: '$exercises' },
                { $match: { 'exercises.exercise': ex.exercise } },
                { $unwind: '$exercises.sets' },
                { $match: { 'exercises.sets.completed': true } },
                { $sort: { 'exercises.sets.weight': -1 } },
                { $limit: 1 }
            ]);

            const priorWeight = priorBest[0]?.exercises?.sets?.weight || 0;
            if (bestSet.weight > priorWeight) {
                const exerciseDoc = await Exercise.findById(ex.exercise);
                personalRecords.push({
                    exerciseName: exerciseDoc?.name || 'Exercise',
                    weight: bestSet.weight,
                    reps: bestSet.reps
                });
            }
        }

        session.status = 'completed';
        session.completedAt = new Date();
        session.durationSeconds = req.body.durationSeconds || Math.round((session.completedAt - session.startedAt) / 1000);
        session.totalSets = totalSets;
        session.totalReps = totalReps;
        session.volumeLifted = volumeLifted;
        session.caloriesBurned = Math.round(totalSets * 8);
        session.personalRecords = personalRecords;

        await session.save();
        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workout-sessions/history
// @desc    Get all completed sessions for the user, most recent first
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ user: req.user.id, status: 'completed' })
            .sort({ date: -1 })
            .populate('exercises.exercise');
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/workout-sessions/:id
// @desc    Get a single session by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.id).populate('exercises.exercise');
        if (!session) return res.status(404).json({ msg: 'Session not found' });
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
