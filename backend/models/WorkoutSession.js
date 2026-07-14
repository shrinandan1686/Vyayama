const mongoose = require('mongoose');

const SetLogSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true },
    weight: { type: Number, default: null },
    reps: { type: Number, default: null },
    notes: { type: String, default: '' },
    completed: { type: Boolean, default: false }
}, { _id: false });

const SessionExerciseSchema = new mongoose.Schema({
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    targetSets: { type: Number, required: true },
    targetRepsMin: { type: Number, required: true },
    targetRepsMax: { type: Number, required: true },
    restSeconds: { type: Number, required: true },
    sets: [SetLogSchema]
}, { _id: false });

const WorkoutSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    workoutType: { type: String, enum: ['A', 'B'], required: true },
    templateName: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    exercises: [SessionExerciseSchema],
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    durationSeconds: { type: Number, default: 0 },
    volumeLifted: { type: Number, default: 0 },
    totalSets: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    personalRecords: [{
        exerciseName: String,
        weight: Number,
        reps: Number
    }]
}, { timestamps: true });

WorkoutSessionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);
