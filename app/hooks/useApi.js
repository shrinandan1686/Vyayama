import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getApiService } from '../services/api';

/**
 * Custom hook to get API service instance with current auth token
 * @returns {ApiService} Configured API service instance
 */
export const useApi = () => {
    const { userToken } = useContext(AuthContext);
    return getApiService(userToken);
};
