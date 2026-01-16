import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Need to install if persisting

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
            // AsyncStorage.setItem('userToken', response.data.token);
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
            // AsyncStorage.setItem('userToken', response.data.token);
            await checkOnboardingStatus(response.data.token);
        } catch (e) {
            console.log(e);
            alert('Registration failed');
        }
        setIsLoading(false);
    };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        setHasOnboarded(false);
        setUserInfo(null);
        // AsyncStorage.removeItem('userToken');
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

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, hasOnboarded, userInfo, checkOnboardingStatus, refreshUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
