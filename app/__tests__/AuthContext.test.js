import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import axios from 'axios';

jest.mock('axios');

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should detect onboarding status correctly', async () => {
        const mockUser = {
            fitnessProfile: {
                age: 25,
                goal: 'Muscle Gain'
            }
        };

        axios.get.mockResolvedValue({ data: mockUser });

        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            await result.current.checkOnboardingStatus('fake-token');
        });

        expect(result.current.hasOnboarded).toBe(true);
        expect(result.current.userInfo).toEqual(mockUser);
    });

    it('should set hasOnboarded to false if profile is incomplete', async () => {
        const mockUser = {
            fitnessProfile: {
                age: 25
                // missing goal
            }
        };

        axios.get.mockResolvedValue({ data: mockUser });

        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            await result.current.checkOnboardingStatus('fake-token');
        });

        expect(result.current.hasOnboarded).toBe(false);
    });

    it('should set hasOnboarded to false on login error', async () => {
        axios.post.mockRejectedValue(new Error('Login failed'));

        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            try {
                await result.current.login('test@test.com', 'pass');
            } catch (e) { }
        });

        expect(result.current.hasOnboarded).toBe(false);
        expect(result.current.userToken).toBe(null);
    });
});
