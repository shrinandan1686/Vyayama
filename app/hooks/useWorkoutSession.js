import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

/**
 * Custom hook to fetch today's scheduled Workout A/B session
 * @returns {{ workoutType, template, loading, refreshing, error, refetch, startSession }}
 */
export const useWorkoutSession = () => {
    const [workoutType, setWorkoutType] = useState(null);
    const [template, setTemplate] = useState(null);
    const [upcoming, setUpcoming] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const api = useApi();

    const fetchToday = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const data = await api.getTodaysWorkoutSchedule();
            setWorkoutType(data.workoutType);
            setTemplate(data.template);
            setUpcoming(data.upcoming || null);
        } catch (e) {
            console.error('Error fetching today\'s workout schedule:', e);
            setError(e.response?.data?.msg || e.message || 'Failed to load workout schedule');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [api]);

    useEffect(() => {
        fetchToday(false);
    }, [fetchToday]);

    const refetch = useCallback(() => fetchToday(true), [fetchToday]);

    const startSession = useCallback(async (type) => {
        return api.startWorkoutSession(type);
    }, [api]);

    return { workoutType, template, upcoming, loading, refreshing, error, refetch, startSession };
};
