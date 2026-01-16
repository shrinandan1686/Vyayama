import { getApiService } from '../services/api';
import axios from 'axios';

jest.mock('axios');

describe('ApiService', () => {
    let api;
    const token = 'test-token';

    beforeEach(() => {
        axios.create.mockReturnValue({
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() }
            },
            defaults: { headers: {} },
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        });
        api = getApiService(token);
    });

    it('should call getProfile with correct path', async () => {
        api.api.get.mockResolvedValue({ data: { name: 'Test' } });
        await api.getProfile();
        expect(api.api.get).toHaveBeenCalledWith('/users/profile');
    });

    it('should call login with correct auth path', async () => {
        api.api.post.mockResolvedValue({ data: { token: 'new-token' } });
        await api.login('test@test.com', 'password');
        expect(api.api.post).toHaveBeenCalledWith('/auth/login', {
            email: 'test@test.com',
            password: 'password'
        });
    });

    it('should call getChatHistory with query params', async () => {
        api.api.get.mockResolvedValue({ data: { history: [] } });
        await api.getChatHistory('session-123');
        expect(api.api.get).toHaveBeenCalledWith('/chat/history', {
            params: { sessionId: 'session-123' }
        });
    });

    it('should call updateExerciseProgress with correct structure', async () => {
        api.api.put.mockResolvedValue({ data: {} });
        await api.updateExerciseProgress('plan-1', 1, 'ex-1', { completed: true });
        expect(api.api.put).toHaveBeenCalledWith(
            '/workout-plans/plan-1/day/1/exercise/ex-1',
            { completed: true }
        );
    });
});
