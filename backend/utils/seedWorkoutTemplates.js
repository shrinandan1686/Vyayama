const Exercise = require('../models/Exercise');
const WorkoutTemplate = require('../models/WorkoutTemplate');

const EXERCISE_DEFS = [
    { name: 'Incline Dumbbell or Machine Press', category: 'Chest', primaryMuscle: 'Upper Chest', equipment: 'Dumbbell', difficulty: 'Intermediate', instructions: ['Set bench to a 30-45 degree incline', 'Press the weights up until arms are extended', 'Lower with control to chest level'] },
    { name: 'Lat Pulldown or Weighted Pull-up', category: 'Back', primaryMuscle: 'Lats', equipment: 'Cable Machine', difficulty: 'Intermediate', instructions: ['Grip the bar wider than shoulder width', 'Pull down to upper chest', 'Control the return to full stretch'] },
    { name: 'Hack Squat or Leg Press', category: 'Legs', primaryMuscle: 'Quadriceps', equipment: 'Machine', difficulty: 'Intermediate', instructions: ['Place feet shoulder width on the platform', 'Lower until knees reach 90 degrees', 'Press back up through the heels'] },
    { name: 'Seated Dumbbell Curl', category: 'Arms', primaryMuscle: 'Biceps', equipment: 'Dumbbell', difficulty: 'Beginner', instructions: ['Sit with back supported', 'Curl the dumbbells up without swinging', 'Lower slowly under control'] },
    { name: 'Overhead Cable Tricep Extension', category: 'Arms', primaryMuscle: 'Triceps', equipment: 'Cable Machine', difficulty: 'Beginner', instructions: ['Face away from the cable machine', 'Extend arms overhead', 'Control the return'] },
    { name: 'Face Pull', category: 'Shoulders', primaryMuscle: 'Rear Delts', equipment: 'Cable Machine', difficulty: 'Beginner', instructions: ['Set the cable to face height', 'Pull the rope towards your face, elbows high', 'Squeeze shoulder blades together'] },
    { name: 'Machine or Dumbbell Shoulder Press', category: 'Shoulders', primaryMuscle: 'Front Delts', equipment: 'Dumbbell', difficulty: 'Intermediate', instructions: ['Press the weights overhead until arms are extended', 'Lower with control to shoulder height'] },
    { name: 'Chest Supported Row', category: 'Back', primaryMuscle: 'Mid Back', equipment: 'Machine', difficulty: 'Intermediate', instructions: ['Chest against the pad', 'Row the weight towards your torso', 'Squeeze shoulder blades together'] },
    { name: 'Romanian Deadlift', category: 'Legs', primaryMuscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Hinge at the hips keeping back flat', 'Lower the bar along your legs', 'Drive hips forward to stand'] },
    { name: 'Cable Lateral Raise', category: 'Shoulders', primaryMuscle: 'Side Delts', equipment: 'Cable Machine', difficulty: 'Beginner', instructions: ['Raise your arm out to the side to shoulder height', 'Control the descent'] },
    { name: 'Standing Calf Raise', category: 'Legs', primaryMuscle: 'Calves', equipment: 'Machine', difficulty: 'Beginner', instructions: ['Rise onto your toes as high as possible', 'Lower heels below the platform for a full stretch'] },
    { name: 'Cable Crunch', category: 'Core', primaryMuscle: 'Abs', equipment: 'Cable Machine', difficulty: 'Beginner', instructions: ['Kneel below the cable', 'Crunch down bringing elbows towards knees', 'Control the return'] },
    { name: 'Hanging Knee Raise', category: 'Core', primaryMuscle: 'Abs', equipment: 'Pull-up Bar', difficulty: 'Intermediate', instructions: ['Hang from the bar with straight arms', 'Raise knees towards chest', 'Lower with control'] }
];

// Rest ranges from the program are normalized to their upper bound (safer recovery);
// exercises with no rep/rest range given default to a 12-15 rep, 60s-rest accessory scheme.
const TEMPLATES = {
    A: {
        name: 'Workout A',
        exercises: [
            { name: 'Incline Dumbbell or Machine Press', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 240 },
            { name: 'Lat Pulldown or Weighted Pull-up', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 180 },
            { name: 'Hack Squat or Leg Press', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 300 },
            { name: 'Seated Dumbbell Curl', sets: 1, targetRepsMin: 8, targetRepsMax: 12, restSeconds: 180 },
            { name: 'Overhead Cable Tricep Extension', sets: 1, targetRepsMin: 8, targetRepsMax: 12, restSeconds: 180 },
            { name: 'Face Pull', sets: 2, targetRepsMin: 15, targetRepsMax: 15, restSeconds: 90 }
        ]
    },
    B: {
        name: 'Workout B',
        exercises: [
            { name: 'Machine or Dumbbell Shoulder Press', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 240 },
            { name: 'Chest Supported Row', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 180 },
            { name: 'Romanian Deadlift', sets: 2, targetRepsMin: 6, targetRepsMax: 10, restSeconds: 300 },
            { name: 'Cable Lateral Raise', sets: 2, targetRepsMin: 10, targetRepsMax: 15, restSeconds: 180 },
            { name: 'Standing Calf Raise', sets: 2, targetRepsMin: 10, targetRepsMax: 15, restSeconds: 180 },
            { name: 'Cable Crunch', sets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
            { name: 'Hanging Knee Raise', sets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 }
        ]
    }
};

// The dev DB is an in-memory mongodb-memory-server instance that resets on every
// restart, so templates must be re-seeded (idempotently) on every server start.
const seedWorkoutTemplates = async () => {
    const existingCount = await WorkoutTemplate.countDocuments({ key: { $in: ['A', 'B'] } });
    if (existingCount === 2) return;

    const exerciseIdByName = {};
    for (const def of EXERCISE_DEFS) {
        let exercise = await Exercise.findOne({ name: def.name });
        if (!exercise) {
            exercise = await Exercise.create({
                ...def,
                youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(def.name)}`
            });
        }
        exerciseIdByName[def.name] = exercise._id;
    }

    for (const key of ['A', 'B']) {
        const def = TEMPLATES[key];
        await WorkoutTemplate.findOneAndUpdate(
            { key },
            {
                key,
                name: def.name,
                exercises: def.exercises.map((ex) => ({
                    exercise: exerciseIdByName[ex.name],
                    sets: ex.sets,
                    targetRepsMin: ex.targetRepsMin,
                    targetRepsMax: ex.targetRepsMax,
                    restSeconds: ex.restSeconds
                }))
            },
            { upsert: true, new: true }
        );
    }

    console.log('Seeded Workout A / Workout B templates');
};

module.exports = { seedWorkoutTemplates };
