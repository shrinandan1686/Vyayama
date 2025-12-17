const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const generateWorkoutPlan = async (userProfile) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/generate-plan`, userProfile);
        return response.data; // Returns { planDurationDays, days: [...] }
    } catch (error) {
        console.error('Error generating workout plan:', error.message);
        throw error;
    }
};

const assessUser = async (userProfile) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/assess-user`, userProfile);
        return response.data;
    } catch (error) {
        console.error('Error assessing user:', error.message);
        throw error;
    }
};

const chatWithAI = async (message, context, userId) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
            message,
            context,
            session_id: userId
        });
        return response.data;
    } catch (error) {
        console.error('Error chatting with AI:', error.message);
        throw error;
    }
};

module.exports = {
    generateWorkoutPlan,
    assessUser,
    chatWithAI
};
