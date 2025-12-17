const mongoose = require('mongoose');

const ExerciseStatusSchema = new mongoose.Schema({
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: Number,
    reps: String,
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false },
    alternativeUsed: { type: Boolean, default: false }
});

const DaySchema = new mongoose.Schema({
    dayNumber: { type: Number, required: true },
    type: { type: String, required: true },
    exercises: [ExerciseStatusSchema],
    completed: { type: Boolean, default: false }
});

const WorkoutPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    days: [DaySchema]
}, { strict: false });

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
