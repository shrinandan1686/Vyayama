const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const auth = require('../middleware/authMiddleware');

// @route   GET api/exercises
// @desc    Get all exercises
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { muscle, equipment, difficulty, search } = req.query;
        let query = {};

        if (muscle) query.primaryMuscle = muscle;
        if (equipment) query.equipment = equipment;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const exercises = await Exercise.find(query);
        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/exercises/:id
// @desc    Get exercise by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).populate('alternatives');
        if (!exercise) return res.status(404).json({ msg: 'Exercise not found' });
        res.json(exercise);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Exercise not found' });
        res.status(500).send('Server error');
    }
});

// @route   POST api/exercises
// @desc    Create an exercise
// @access  Private (should be admin, but using auth for now)
router.post('/', auth, async (req, res) => {
    const { name, category, primaryMuscle, secondaryMuscles, equipment, difficulty, instructions, videoLink, alternatives } = req.body;

    try {
        const newExercise = new Exercise({
            name,
            category,
            primaryMuscle,
            secondaryMuscles,
            equipment,
            difficulty,
            instructions,
            videoLink,
            alternatives
        });

        const exercise = await newExercise.save();
        res.json(exercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
