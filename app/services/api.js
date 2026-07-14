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
                    // 404/400 are often valid responses (e.g., no workout plan found yet)
                    // Don't log them as errors to avoid confusion for users
                    if (error.response.status !== 404 && error.response.status !== 400) {
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
        const { data } = await this.api.post('/auth/register', { email, password, name });
        return data;
    }

    async login(email, password) {
        const { data } = await this.api.post('/auth/login', { email, password });
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
        // Redirect to updateProfile as it handles the Same logic
        return this.updateProfile(onboardingData);
    }

    // ============ WORKOUT PLAN ENDPOINTS ============

    async getWorkoutPlan() {
        const { data } = await this.api.get('/workout-plans');
        return data;
    }

    async generateWorkoutPlan(userProfile = {}) {
        const { data } = await this.api.post('/workout-plans', userProfile);
        return data;
    }

    async getWorkoutPlanById(planId) {
        const { data } = await this.api.get(`/workout-plans/${planId}`);
        return data;
    }

    async updateExerciseProgress(planId, dayNumber, exerciseId, progressData) {
        // progressData: { completed, skipped, alternativeUsed }
        const { data } = await this.api.put(`/workout-plans/${planId}/day/${dayNumber}/exercise/${exerciseId}`, progressData);
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
        const { data } = await this.api.get('/chat/history', {
            params: { sessionId }
        });
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

    // ============ USER DAY PROGRESSION ============

    async updateCurrentDay(day) {
        const { data } = await this.api.put('/users/current-day', { currentWorkoutDay: day });
        return data;
    }

    async advanceToNextDay() {
        // Get current profile to know current day
        const profile = await this.getProfile();
        const nextDay = (profile.currentWorkoutDay || 1) + 1;
        return this.updateCurrentDay(nextDay);
    }

    async generateAndAdvanceDay() {
        const { data } = await this.api.post('/workout-plans/next-day');
        return data;
    }

    // ============ WORKOUT SESSION ENDPOINTS ============

    async getTodaysWorkoutSchedule() {
        const { data } = await this.api.get('/workout-sessions/today');
        return data;
    }

    async startWorkoutSession(workoutType) {
        const { data } = await this.api.post('/workout-sessions', { workoutType });
        return data;
    }

    async updateWorkoutSet(sessionId, exerciseIndex, setIndex, setData) {
        const { data } = await this.api.put(`/workout-sessions/${sessionId}/set`, {
            exerciseIndex,
            setIndex,
            ...setData
        });
        return data;
    }

    async completeWorkoutSession(sessionId, durationSeconds) {
        const { data } = await this.api.put(`/workout-sessions/${sessionId}/complete`, { durationSeconds });
        return data;
    }

    async getWorkoutSessionHistory() {
        const { data } = await this.api.get('/workout-sessions/history');
        return data;
    }

    async getWorkoutSession(sessionId) {
        const { data } = await this.api.get(`/workout-sessions/${sessionId}`);
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
