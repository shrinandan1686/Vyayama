import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Reusable rest-timer countdown state machine. Kept independent of any
 * screen so a future Settings-driven default-rest preference can reuse it.
 * @returns {{ secondsLeft, isPaused, isActive, finished, start, pause, resume, skip, adjust }}
 */
export const useRestTimer = (defaultSeconds) => {
    const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
    const [isPaused, setIsPaused] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, isPaused]);

    const start = useCallback((seconds = defaultSeconds) => {
        setSecondsLeft(seconds);
        setIsPaused(false);
        setIsActive(true);
    }, [defaultSeconds]);

    const pause = useCallback(() => setIsPaused(true), []);
    const resume = useCallback(() => setIsPaused(false), []);

    const skip = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        setSecondsLeft(0);
    }, []);

    const adjust = useCallback((deltaSeconds) => {
        setSecondsLeft((prev) => Math.max(0, prev + deltaSeconds));
    }, []);

    const finished = isActive && secondsLeft === 0;

    return { secondsLeft, isPaused, isActive, finished, start, pause, resume, skip, adjust };
};
