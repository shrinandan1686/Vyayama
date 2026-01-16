const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const WorkoutPlan = require('../models/WorkoutPlan');
const Activity = require('../models/Activity');

describe('Workout Plans API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Workout User',
                email: 'workout@example.com',
                password: 'password123'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'workout@example.com',
                password: 'password123'
            });
        token = loginRes.body.token;

        const userRes = await request(app)
            .get('/api/auth/user')
            .set('x-auth-token', token);
        userId = userRes.body._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 404 when no plan exists', async () => {
        const res = await request(app)
            .get('/api/workout-plans')
            .set('x-auth-token', token);

        expect(res.statusCode).toEqual(404);
        expect(res.body.msg).toBe('No workout plan found');
    });

    it('should create an activity when an exercise is marked as complete', async () => {
        // 1. Create a dummy plan
        const plan = new WorkoutPlan({
            user: userId,
            days: [{
                dayNumber: 1,
                type: 'Strength',
                exercises: [{
                    exercise: new mongoose.Types.ObjectId(),
                    sets: 3,
                    reps: '10',
                    completed: false
                }]
            }]
        });
        await plan.save();

        const exerciseId = plan.days[0].exercises[0]._id;

        // 2. Mark exercise as complete
        const res = await request(app)
            .put(`/api/workout-plans/${plan._id}/day/1/exercise/${exerciseId}`)
            .set('x-auth-token', token)
            .send({ completed: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body.days[0].exercises[0].completed).toBe(true);

        // 3. Verify activity creation
        const activity = await Activity.findOne({ userId });
        expect(activity).not.toBeNull();
        expect(activity.exercises.length).toBe(1);
        expect(activity.caloriesBurned).toBe(50); // From the logic added in workoutPlans.js
    });
});
