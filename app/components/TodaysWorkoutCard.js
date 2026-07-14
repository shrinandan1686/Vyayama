import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from './GlassCard';
import AppButton from './AppButton';
import Tag from './Tag';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useApi } from '../hooks/useApi';

const MUSCLE_SUMMARY = {
    A: 'Chest, Back, Legs, Arms',
    B: 'Shoulders, Back, Legs, Core'
};

const TodaysWorkoutCard = ({ navigation }) => {
    const { workoutType, template, upcoming, loading, error } = useWorkoutSession();
    const api = useApi();
    const [starting, setStarting] = useState(false);

    const handleStart = async (type) => {
        try {
            setStarting(true);
            const session = await api.startWorkoutSession(type);
            navigation.navigate('WorkoutSession', { session });
        } catch (e) {
            console.error('Error starting workout session:', e);
        } finally {
            setStarting(false);
        }
    };

    if (loading) return null;

    if (error || !workoutType || !template) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>TODAY'S WORKOUT</Text>
                <GlassCard>
                    <View style={styles.restContent}>
                        <Ionicons name="moon-outline" size={40} color={COLORS.textSecondary} style={{ marginBottom: 12 }} />
                        <Text style={styles.restTitle}>Rest Day</Text>
                        <Text style={styles.restText}>No scheduled session today. Recover up and come back stronger.</Text>

                        {upcoming && upcoming.template && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.upcomingLabel}>
                                    Next: {upcoming.dayName} &bull; {upcoming.template.name}
                                </Text>
                                <AppButton
                                    title="Start Workout Anyway"
                                    variant="secondary"
                                    loading={starting}
                                    onPress={() => handleStart(upcoming.workoutType)}
                                    style={{ marginTop: SIZES.marginSmall, width: '100%' }}
                                />
                            </>
                        )}
                    </View>
                </GlassCard>
            </View>
        );
    }

    const exerciseCount = template.exercises.length;
    const estimatedMinutes = template.exercises.reduce((sum, ex) => {
        const restMinutes = ex.restSeconds / 60;
        return sum + ex.sets * (restMinutes + 1.5);
    }, 0);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY'S WORKOUT</Text>
            <GlassCard>
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.workoutName}>{template.name}</Text>
                        <Tag label={`Workout ${workoutType}`} variant="secondary" />
                    </View>
                    <Text style={styles.meta}>
                        {exerciseCount} Exercises &bull; ~{Math.round(estimatedMinutes)} min
                    </Text>
                    <Text style={styles.muscles}>{MUSCLE_SUMMARY[workoutType]}</Text>

                    <AppButton
                        title="Start Workout"
                        onPress={() => handleStart(workoutType)}
                        loading={starting}
                        style={{ marginTop: SIZES.marginSection }}
                    />
                </View>
            </GlassCard>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginTop: 25 },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: SIZES.caption,
        marginBottom: SIZES.marginSmall
    },
    content: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    workoutName: { ...FONTS.h3, color: COLORS.white },
    meta: { ...FONTS.body4, color: COLORS.textSecondary, marginTop: 6 },
    muscles: { ...FONTS.body4, color: COLORS.text, marginTop: 4 },
    restContent: { padding: 20, alignItems: 'center' },
    restTitle: { ...FONTS.h3, color: COLORS.white, marginBottom: 6 },
    restText: { ...FONTS.body4, color: COLORS.textSecondary, textAlign: 'center' },
    divider: { height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: SIZES.marginSection },
    upcomingLabel: { ...FONTS.body4, color: COLORS.textSecondary, marginBottom: SIZES.marginSmall }
});

export default TodaysWorkoutCard;
