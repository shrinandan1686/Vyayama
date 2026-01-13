const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    workoutDate: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutPlan'
    },
    dayNumber: {
        type: Number
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    exercises: [{
        exerciseId: mongoose.Schema.Types.ObjectId,
        name: String,
        sets: Number,
        reps: Number,
        completed: Boolean
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
ActivitySchema.index({ userId: 1, workoutDate: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
