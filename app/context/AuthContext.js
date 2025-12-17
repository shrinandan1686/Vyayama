import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Need to install if persisting

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            setUserToken(response.data.token);
            // AsyncStorage.setItem('userToken', response.data.token);
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
        } catch (e) {
            console.log(e);
            alert('Registration failed');
        }
        setIsLoading(false);
    };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        // AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};
