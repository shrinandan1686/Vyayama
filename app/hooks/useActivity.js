import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

/**
 * Custom hook to manage activity stats and weekly data
 * @returns {{ stats, weeklyData, loading, error, logWorkout, refetch }} Activity state and actions
 */
export const useActivity = () => {
    const [stats, setStats] = useState({ totalCalories: 0, totalWorkouts: 0, currentStreak: 0 });
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = useApi();

    const fetchActivity = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, weeklyDataRes] = await Promise.all([
                api.getActivityStats(),
                api.getWeeklyActivity()
            ]);

            setStats(statsData);
            setWeeklyData(weeklyDataRes);
        } catch (e) {
            console.error('Error fetching activity:', e);
            // If 404, just use defaults (no activity yet)
            if (e.response?.status === 404) {
                setStats({ totalCalories: 0, totalWorkouts: 0, currentStreak: 0 });
                setWeeklyData([]);
            } else {
                setError(e.response?.data?.message || e.message || 'Failed to load activity');
            }
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    const logWorkout = useCallback(async (workoutData) => {
        try {
            await api.logWorkout(workoutData);
            // Refetch stats after logging
            await fetchActivity();
        } catch (e) {
            console.error('Error logging workout:', e);
            throw e;
        }
    }, [api, fetchActivity]);

    const refetch = useCallback(() => {
        fetchActivity();
    }, [fetchActivity]);

    return { stats, weeklyData, loading, error, logWorkout, refetch };
};
