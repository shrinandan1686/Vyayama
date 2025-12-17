const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../services/aiService');
const auth = require('../middleware/authMiddleware');

// @route   POST api/chat
// @desc    Chat with AI Health Coach
// @access  Private (or Public if we want)
router.post('/', auth, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ msg: 'Message is required' });
        }

        const data = await chatWithAI(message, context, req.user.id);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
