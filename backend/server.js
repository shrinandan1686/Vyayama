require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Tests always run against an isolated in-memory DB. Otherwise, use a
// persistent MongoDB Atlas connection if MONGODB_URI is set, falling back
// to an in-memory DB (data lost on every restart) if it isn't configured.
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        const usingAtlas = uri && process.env.NODE_ENV !== 'test';

        if (!usingAtlas) {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected (${usingAtlas ? 'Atlas' : 'In-Memory'})`);

        const { seedWorkoutTemplates } = require('./utils/seedWorkoutTemplates');
        await seedWorkoutTemplates();
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Vyayama Backend is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/workout-plans', require('./routes/workoutPlans'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/workout-sessions', require('./routes/workoutSessions'));

// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
