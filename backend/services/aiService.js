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

const generateNextDay = async (userProfile, currentDay, previousWorkoutFocus = null) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/generate-next-day`, {
            profile: userProfile,
            currentDay: currentDay,
            previousWorkoutFocus: previousWorkoutFocus
        });
        return response.data; // Returns DailyWorkout object
    } catch (error) {
        console.error('Error generating next day:', error.message);
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

const chatWithAI = async (message, context, userId, imageBase64 = null, sessionId = null) => {
    try {
        const finalSessionId = sessionId
            ? (sessionId.startsWith(`user_${userId}_`) ? sessionId : `user_${userId}_${sessionId}`)
            : `user_${userId}_default`;
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
            message,
            context,
            session_id: finalSessionId,
            image_base64: imageBase64
        });
        return response.data;
    } catch (error) {
        console.error('Error chatting with AI:', error.message);
        throw error;
    }
};

const getChatHistory = async (userId, sessionId = null) => {
    try {
        const finalSessionId = sessionId
            ? (sessionId.startsWith(`user_${userId}_`) ? sessionId : `user_${userId}_${sessionId}`)
            : `user_${userId}_default`;

        const response = await axios.get(`${AI_SERVICE_URL}/chat/history/${finalSessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        throw error;
    }
};

const getChatSessions = async (userId) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/chat/sessions/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat sessions:', error.message);
        throw error;
    }
};

const resetChatSession = async (userId, sessionId = null) => {
    try {
        const finalSessionId = sessionId
            ? (sessionId.startsWith(`user_${userId}_`) ? sessionId : `user_${userId}_${sessionId}`)
            : `user_${userId}_default`;

        const response = await axios.delete(`${AI_SERVICE_URL}/chat/session/${finalSessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error resetting chat session:', error.message);
        throw error;
    }
};

module.exports = {
    generateWorkoutPlan,
    generateNextDay,
    assessUser,
    chatWithAI,
    getChatHistory,
    getChatSessions,
    resetChatSession
};
