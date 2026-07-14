const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Week 1: Mon->A, Wed->B, Fri->A. Week 2: Mon->B, Wed->A, Fri->B. Repeats every 2 weeks.
const WEEK_SCHEDULE = [
    { Mon: 'A', Wed: 'B', Fri: 'A' },
    { Mon: 'B', Wed: 'A', Fri: 'B' }
];

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const mondayOnOrBefore = (date) => {
    const d = startOfDay(date);
    const daysSinceMonday = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
    d.setDate(d.getDate() - daysSinceMonday);
    return d;
};

/**
 * Returns 'A' | 'B' | null for a given date, based on a repeating 2-week
 * Mon/Wed/Fri rotation anchored to the week containing anchorDate.
 */
const getScheduledWorkout = (anchorDate, targetDate = new Date()) => {
    const dayName = DAY_NAMES[startOfDay(targetDate).getDay()];
    if (!(dayName in WEEK_SCHEDULE[0])) return null;

    const anchorMonday = mondayOnOrBefore(anchorDate);
    const targetMonday = mondayOnOrBefore(targetDate);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceAnchor = Math.round((targetMonday - anchorMonday) / msPerWeek);
    const cycleWeek = ((weeksSinceAnchor % 2) + 2) % 2;

    return WEEK_SCHEDULE[cycleWeek][dayName];
};

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Looks forward (including fromDate itself) up to 7 days to find the next
 * scheduled Workout A/B day - lets a user start early instead of waiting
 * for the next Mon/Wed/Fri.
 */
const getUpcomingWorkout = (anchorDate, fromDate = new Date()) => {
    for (let i = 0; i < 7; i++) {
        const candidate = new Date(fromDate);
        candidate.setDate(candidate.getDate() + i);
        const workoutType = getScheduledWorkout(anchorDate, candidate);
        if (workoutType) {
            const day = startOfDay(candidate);
            return { workoutType, dayName: DAY_NAMES_FULL[day.getDay()], daysAhead: i };
        }
    }
    return null;
};

module.exports = { getScheduledWorkout, getUpcomingWorkout };
