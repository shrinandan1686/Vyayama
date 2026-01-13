import axios from 'axios';
import API_URL from '../config';

class ApiService {
    constructor(token = null) {
        this.token = token;
        this.api = axios.create({
            baseURL: API_URL,
            headers: token ? { 'x-auth-token': token } : {},
            timeout: 10000,
        });

        // Request interceptor for logging/debugging
        this.api.interceptors.request.use(
            (config) => {
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    // 404 is a valid response (e.g., no workout plan found yet)
                    // Don't log it as an error to avoid confusion
                    if (error.response.status !== 404) {
                        console.error('API Error:', error.response.status, error.response.data);
                    }
                } else if (error.request) {
                    // Request made but no response
                    console.error('Network Error:', error.message);
                } else {
                    console.error('Request Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    // Update token (e.g., after login)
    setToken(token) {
        this.token = token;
        this.api.defaults.headers['x-auth-token'] = token;
    }

    // Clear token (e.g., on logout)
    clearToken() {
        this.token = null;
        delete this.api.defaults.headers['x-auth-token'];
    }

    // ============ AUTH ENDPOINTS ============

    async register(email, password, name) {
        const { data } = await this.api.post('/users/register', { email, password, name });
        return data;
    }

    async login(email, password) {
        const { data } = await this.api.post('/users/login', { email, password });
        return data;
    }

    // ============ USER ENDPOINTS ============

    async getProfile() {
        const { data } = await this.api.get('/users/profile');
        return data;
    }

    async updateProfile(profileData) {
        const { data } = await this.api.put('/users/profile', profileData);
        return data;
    }

    async completeOnboarding(onboardingData) {
        const { data } = await this.api.post('/users/onboarding', onboardingData);
        return data;
    }

    // ============ WORKOUT PLAN ENDPOINTS ============

    async getWorkoutPlan() {
        const { data } = await this.api.get('/workout-plans');
        return data;
    }

    async generateWorkoutPlan(userProfile) {
        const { data } = await this.api.post('/workout-plans/generate', userProfile);
        return data;
    }

    async getWorkoutPlanById(planId) {
        const { data } = await this.api.get(`/workout-plans/${planId}`);
        return data;
    }

    async updateDayProgress(planId, dayNumber, completed) {
        const { data } = await this.api.put(`/workout-plans/${planId}/days/${dayNumber}`, { completed });
        return data;
    }

    // ============ CHAT ENDPOINTS ============

    async sendChatMessage(message, sessionId, imageBase64 = null) {
        const payload = {
            message,
            sessionId,
        };

        if (imageBase64) {
            payload.image = imageBase64;
        }

        const { data } = await this.api.post('/chat', payload);
        return data;
    }

    async getChatHistory(sessionId) {
        const { data } = await this.api.get(`/chat/history/${sessionId}`);
        return data;
    }

    async getChatSessions() {
        const { data } = await this.api.get('/chat/sessions');
        return data;
    }

    async createChatSession(title = 'New Chat') {
        const { data } = await this.api.post('/chat/sessions', { title });
        return data;
    }

    // ============ ACTIVITY ENDPOINTS ============

    async logWorkout(workoutData) {
        const { data } = await this.api.post('/activity/log-workout', workoutData);
        return data;
    }

    async getActivityStats() {
        const { data } = await this.api.get('/activity/stats');
        return data;
    }

    async getWeeklyActivity() {
        const { data } = await this.api.get('/activity/weekly');
        return data;
    }
}

// Export singleton instance
let apiServiceInstance = null;

export const getApiService = (token = null) => {
    if (!apiServiceInstance) {
        apiServiceInstance = new ApiService(token);
    } else if (token) {
        apiServiceInstance.setToken(token);
    }
    return apiServiceInstance;
};

export default ApiService;
