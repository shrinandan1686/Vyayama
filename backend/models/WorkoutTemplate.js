const mongoose = require('mongoose');

const TemplateExerciseSchema = new mongoose.Schema({
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    targetRepsMin: { type: Number, required: true },
    targetRepsMax: { type: Number, required: true },
    restSeconds: { type: Number, required: true }
}, { _id: false });

const WorkoutTemplateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, enum: ['A', 'B'] },
    name: { type: String, required: true },
    exercises: [TemplateExerciseSchema]
});

module.exports = mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);
