import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config';

const TOKEN_STORAGE_KEY = 'userToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            setUserToken(response.data.token);
            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
            await checkOnboardingStatus(response.data.token);
        } catch (e) {
            console.log(e);
            alert('Login failed');
        }
        setIsLoading(false);
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password
            });
            setUserToken(response.data.token);
            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
            await checkOnboardingStatus(response.data.token);
        } catch (e) {
            console.log(e);
            alert('Registration failed');
        }
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setHasOnboarded(false);
        setUserInfo(null);
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        setIsLoading(false);
    };

    const checkOnboardingStatus = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers: { 'x-auth-token': token }
            });
            const user = response.data;
            setUserInfo(user);

            // Check if essential fitness profile fields exist
            const hasProfile = user.fitnessProfile &&
                user.fitnessProfile.age &&
                user.fitnessProfile.goal;

            setHasOnboarded(!!hasProfile);
        } catch (e) {
            console.log('Error checking onboarding status:', e);
            setHasOnboarded(false);
        }
    };

    const refreshUserInfo = async () => {
        if (userToken) {
            await checkOnboardingStatus(userToken);
        }
    };

    // Restore a persisted session when the app starts or reloads
    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
                if (storedToken) {
                    setUserToken(storedToken);
                    await checkOnboardingStatus(storedToken);
                }
            } catch (e) {
                console.log('Error restoring session:', e);
            }
            setIsLoading(false);
        };

        bootstrapAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, hasOnboarded, userInfo, checkOnboardingStatus, refreshUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
