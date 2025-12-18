const express = require('express');
const router = express.Router();
const { chatWithAI, getChatHistory, resetChatSession, getChatSessions } = require('../services/aiService');
const auth = require('../middleware/authMiddleware');

// @route   POST api/chat
// @desc    Chat with AI Health Coach
// @access  Private (or Public if we want)
router.post('/', auth, async (req, res) => {
    try {
        const { message, context, imageBase64, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ msg: 'Message is required' });
        }

        const data = await chatWithAI(message, context, req.user.id, imageBase64, sessionId);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/chat/history
// @desc    Get chat history for current session
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const { sessionId } = req.query;
        const data = await getChatHistory(req.user.id, sessionId);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/chat/sessions
// @desc    Get all chat sessions for user
// @access  Private
router.get('/sessions', auth, async (req, res) => {
    try {
        const data = await getChatSessions(req.user.id);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/chat/session
// @desc    Reset chat session
// @access  Private
router.delete('/session', auth, async (req, res) => {
    try {
        const { sessionId } = req.query;
        const data = await resetChatSession(req.user.id, sessionId);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
