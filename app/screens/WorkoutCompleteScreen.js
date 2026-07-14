import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useApi } from '../hooks/useApi';

const formatDuration = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
};

const computeSummary = (session) => {
    let totalSets = 0;
    let totalReps = 0;
    let volumeLifted = 0;
    for (const ex of session.exercises) {
        for (const set of ex.sets) {
            if (set.completed) {
                totalSets += 1;
                totalReps += set.reps || 0;
                volumeLifted += (set.weight || 0) * (set.reps || 0);
            }
        }
    }
    return { totalSets, totalReps, volumeLifted, caloriesBurned: Math.round(totalSets * 8) };
};

const StatBlock = ({ label, value }) => (
    <View style={styles.statBlock}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const WorkoutCompleteScreen = ({ route, navigation }) => {
    const { session: initialSession } = route.params;
    const api = useApi();

    const [session, setSession] = useState(initialSession);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const summary = useMemo(() => computeSummary(session), [session]);
    const durationSeconds = Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000);

    const goHome = () => {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const completed = await api.completeWorkoutSession(session._id, durationSeconds);
            setSession(completed);
            setSaved(true);
        } catch (e) {
            console.error('Error saving workout:', e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Ionicons name="trophy" size={56} color={COLORS.secondary} />
                    <Text style={styles.title}>Workout Complete</Text>
                    <Text style={styles.subtitle}>{session.templateName}</Text>
                </View>

                <GlassCard style={styles.statsCard}>
                    <View style={styles.statsGrid}>
                        <StatBlock label="Duration" value={formatDuration(durationSeconds)} />
                        <StatBlock label="Volume Lifted" value={`${summary.volumeLifted.toLocaleString()} kg`} />
                        <StatBlock label="Total Sets" value={summary.totalSets} />
                        <StatBlock label="Total Reps" value={summary.totalReps} />
                        <StatBlock label="Calories (est.)" value={summary.caloriesBurned} />
                    </View>
                </GlassCard>

                {saved && session.personalRecords && session.personalRecords.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PERSONAL RECORDS</Text>
                        <GlassCard>
                            <View style={{ padding: SIZES.padding }}>
                                {session.personalRecords.map((pr, i) => (
                                    <View key={i} style={styles.prRow}>
                                        <Ionicons name="star" size={18} color={COLORS.secondary} />
                                        <Text style={styles.prText}>{pr.exerciseName}: {pr.weight}kg x {pr.reps}</Text>
                                    </View>
                                ))}
                            </View>
                        </GlassCard>
                    </View>
                )}

                <AppButton
                    title={saved ? 'Saved ✓' : 'Save Workout'}
                    onPress={handleSave}
                    loading={saving}
                    disabled={saved}
                    style={{ marginTop: SIZES.marginSection }}
                />
                <AppButton title="Return Home" onPress={goHome} variant="secondary" />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 40, paddingTop: 20 },
    header: { alignItems: 'center', marginBottom: SIZES.marginSection },
    title: { ...FONTS.h1, color: COLORS.white, marginTop: SIZES.marginSmall },
    subtitle: { ...FONTS.body3, color: COLORS.textSecondary, marginTop: 4 },
    statsCard: {},
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SIZES.padding },
    statBlock: { width: '50%', marginBottom: SIZES.marginSection },
    statValue: { ...FONTS.h2, color: COLORS.white },
    statLabel: { ...FONTS.body4, color: COLORS.textSecondary, marginTop: 2 },
    section: { marginTop: SIZES.marginSection },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: SIZES.caption,
        marginBottom: SIZES.marginSmall
    },
    prRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.marginSmall, gap: 8 },
    prText: { ...FONTS.body3, color: COLORS.white }
});

export default WorkoutCompleteScreen;
