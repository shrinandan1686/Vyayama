const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');
const Activity = require('../models/Activity');

// @route   POST /api/activity/log-workout
// @desc    Log a completed workout
// @access  Private
router.post('/log-workout', auth, async (req, res) => {
    try {
        const { planId, dayNumber, caloriesBurned, duration, exercises } = req.body;

        const activity = new Activity({
            userId: req.user.id,
            planId,
            dayNumber,
            caloriesBurned: caloriesBurned || 0,
            duration: duration || 0,
            exercises: exercises || [],
            workoutDate: new Date()
        });

        await activity.save();

        res.json(activity);
    } catch (err) {
        console.error('Error logging workout:', err);
        res.status(500).json({ msg: 'Server error logging workout' });
    }
});

// @route   GET /api/activity/stats
// @desc    Get user activity  stats (total calories, workouts, streak)
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get total calories and workouts
        const stats = await Activity.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: '$caloriesBurned' },
                    totalWorkouts: { $sum: 1 }
                }
            }
        ]);

        // Calculate streak
        const activities = await Activity.find({ userId })
            .sort({ workoutDate: -1 })
            .select('workoutDate');

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let activity of activities) {
            const activityDate = new Date(activity.workoutDate);
            activityDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === streak) {
                streak++;
            } else if (daysDiff > streak) {
                break;
            }
        }

        const result = stats[0] || { totalCalories: 0, totalWorkouts: 0 };

        res.json({
            totalCalories: result.totalCalories,
            totalWorkouts: result.totalWorkouts,
            currentStreak: streak
        });
    } catch (err) {
        console.error('Error getting stats:', err);
        res.status(500).json({ msg: 'Server error getting stats' });
    }
});

// @route   GET /api/activity/weekly
// @desc    Get last 7 days of activity
// @access  Private
router.get('/weekly', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const activities = await Activity.find({
            userId,
            workoutDate: { $gte: sevenDaysAgo }
        }).sort({ workoutDate: 1 });

        // Group by day
        const weeklyData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayActivities = activities.filter(a => {
                const activityDate = new Date(a.workoutDate);
                return activityDate >= date && activityDate < nextDate;
            });

            const dayName = days[date.getDay()];
            const workouts = dayActivities.length;
            const calories = dayActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);

            weeklyData.push({
                day: dayName,
                date: date.toISOString(),
                workouts,
                calories
            });
        }

        res.json(weeklyData);
    } catch (err) {
        console.error('Error getting weekly activity:', err);
        res.status(500).json({ msg: 'Server error getting weekly activity' });
    }
});

module.exports = router;
