const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Users API', () => {
    let token;

    beforeAll(async () => {
        // Register and login to get token
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Profile User',
                email: 'profile@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'profile@example.com',
                password: 'password123'
            });
        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should get current user profile', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('x-auth-token', token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toBe('profile@example.com');
    });

    it('should update user profile (onboarding)', async () => {
        const profileData = {
            age: 30,
            weight: 80,
            height: 180,
            goal: 'Muscle Gain',
            experienceLevel: 'Intermediate',
            daysPerWeek: 4
        };

        const res = await request(app)
            .put('/api/users/profile')
            .set('x-auth-token', token)
            .send(profileData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.fitnessProfile.age).toBe(30);
        expect(res.body.fitnessProfile.goal).toBe('Muscle Gain');
    });

    it('should fail fetching profile without token', async () => {
        const res = await request(app).get('/api/users/profile');
        expect(res.statusCode).toEqual(401);
    });
});
