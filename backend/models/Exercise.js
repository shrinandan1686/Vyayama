const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Chest, Legs, etc.
    primaryMuscle: { type: String, required: true },
    secondaryMuscles: [String],
    equipment: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    instructions: [String],
    videoLink: String, // Keep for backward compat or internal video
    youtubeUrl: String, // New field for external YouTube tutorials
    alternatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
