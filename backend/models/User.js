const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fitnessProfile: {
        age: Number,
        gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'] },
        weight: Number,
        height: Number,
        goal: { type: String, enum: ['Fat Loss', 'Muscle Gain', 'Strength', 'General Fitness'] },
        experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
        gymComfort: { type: String }, // e.g., 'Very uncomfortable'
        gymConfidence: { type: String },
        bodyType: { type: String, enum: ['Ectomorph', 'Mesomorph', 'Endomorph', 'Not sure'] },
        focusAreas: [String], // Chest, Back, etc.
        gymCrowdLevel: { type: String }, // Mostly free, etc.
        averageWorkoutDuration: Number, // in minutes
        equipment: [String],
        daysPerWeek: Number,
        injuries: [String]
    },
    currentWorkoutDay: { type: Number, default: 1 },
    planStartDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
