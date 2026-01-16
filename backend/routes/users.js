const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// @route   GET api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/users/profile
// @desc    Update user profile (Onboarding)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { age, weight, height, goal, experienceLevel, equipment, daysPerWeek, injuries } = req.body;

    // Build profile object
    const profileFields = {};
    if (age) profileFields.age = age;
    if (weight) profileFields.weight = weight;
    if (height) profileFields.height = height;
    if (goal) profileFields.goal = goal;
    if (experienceLevel) profileFields.experienceLevel = experienceLevel;
    if (equipment) profileFields.equipment = equipment;
    if (daysPerWeek) profileFields.daysPerWeek = daysPerWeek;
    if (injuries) profileFields.injuries = injuries;

    try {
        let user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.fitnessProfile = { ...user.fitnessProfile, ...profileFields };

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/users/current-day
// @desc    Update user's current workout day
// @access  Private
router.put('/current-day', auth, async (req, res) => {
    try {
        const { currentWorkoutDay } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.currentWorkoutDay = currentWorkoutDay;

        // Set plan start date on first day
        if (currentWorkoutDay === 1 && !user.planStartDate) {
            user.planStartDate = new Date();
        }

        await user.save();
        res.json({ currentWorkoutDay: user.currentWorkoutDay });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
