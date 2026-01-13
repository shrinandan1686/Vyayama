import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

/**
 * Custom hook to fetch and manage workout plan data
 * @returns {{ plan, loading, refreshing, error, refetch }} Workout plan state and actions
 */
export const useWorkoutPlan = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const api = useApi();

    const fetchPlan = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const data = await api.getWorkoutPlan();
            setPlan(data);
        } catch (e) {
            // 404 means no plan found - this is not an error, just an empty state
            if (e.response?.status === 404) {
                setPlan(null);
                setError(null);
            } else {
                // Only set error for actual errors (network, server, etc.)
                console.error('Error fetching workout plan:', e);
                setError(e.response?.data?.message || e.message || 'Failed to load workout plan');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [api]);

    useEffect(() => {
        fetchPlan(false);
    }, [fetchPlan]);

    const refetch = useCallback(() => {
        fetchPlan(true);
    }, [fetchPlan]);

    return { plan, loading, refreshing, error, refetch };
};
