import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useWorkoutPlan } from '../hooks/useWorkoutPlan';
import { useApi } from '../hooks/useApi';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import AppButton from '../components/AppButton';
import { StatusBar } from 'expo-status-bar';
import GlassCard from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import Tag from '../components/Tag';
import WorkoutPlanSkeleton from '../components/WorkoutPlanSkeleton';
import TodaysWorkoutCard from '../components/TodaysWorkoutCard';

const HomeScreen = ({ navigation }) => {
    const { userInfo, refreshUserInfo } = useContext(AuthContext);
    const { plan, loading, refreshing, error, refetch } = useWorkoutPlan();
    const isFocused = useIsFocused();
    const [advancingDay, setAdvancingDay] = React.useState(false);
    const api = useApi();

    // Refetch when screen comes into focus
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    if (loading) {
        return (
            <ScreenWrapper>
                <StatusBar style="light" />
                <WorkoutPlanSkeleton />
            </ScreenWrapper>
        );
    }

    if (error) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center', padding: SIZES.padding }}>
                <Text style={{ color: COLORS.error, ...FONTS.body3, marginBottom: SIZES.marginSection }}>
                    {error}
                </Text>
                <AppButton title="Retry" onPress={refetch} />
            </ScreenWrapper>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.greeting}>Hello, Athlete</Text>
            <Text style={styles.subGreeting}>Ready to crush it today?</Text>
        </View>
    );

    const renderNoPlanState = () => (
        <GlassCard style={styles.noPlanContainer}>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="barbell-outline" size={50} color={COLORS.primary} style={{ marginBottom: 15 }} />
                <Text style={styles.noPlanTitle}>No Plan Found</Text>
                <Text style={styles.noPlanText}>
                    You haven't started your journey yet. Let our AI build a custom plan for you.
                </Text>
                <AppButton
                    title="Create My Plan"
                    onPress={() => navigation.navigate('Onboarding')}
                    style={{ marginTop: 20, width: '100%' }}
                />
            </View>
        </GlassCard>
    );

    const renderTodayWorkout = () => {
        // Get current day from user profile, default to 1
        const currentDay = userInfo?.currentWorkoutDay || 1;
        const day = plan.days.find(d => d.dayNumber === currentDay) || plan.days[0];

        // Calculate progress through plan
        const totalDays = plan.days.length;
        const progressPercent = Math.round((currentDay / totalDays) * 100);

        const handlePreviousDay = async () => {
            if (currentDay <= 1) {
                Alert.alert('Info', 'You are already on Day 1');
                return;
            }

            try {
                setAdvancingDay(true);
                await api.updateCurrentDay(currentDay - 1);
                await refreshUserInfo();
                await refetch();
            } catch (error) {
                console.error('Error going to previous day:', error);
                Alert.alert('Error', 'Failed to go to previous day');
            } finally {
                setAdvancingDay(false);
            }
        };

        const handleNextDay = async () => {
            const nextDayNumber = currentDay + 1;

            // Check if next day already exists in the plan
            const nextDayExists = plan.days.find(d => d.dayNumber === nextDayNumber);

            try {
                setAdvancingDay(true);

                if (!nextDayExists) {
                    // Generate new day if it doesn't exist
                    console.log(`Day ${nextDayNumber} doesn't exist, generating with AI...`);
                    await api.generateAndAdvanceDay();
                }

                // Update current day pointer
                await api.updateCurrentDay(nextDayNumber);

                // Refresh user info and workout plan
                await refreshUserInfo();
                await refetch();

                if (!nextDayExists) {
                    Alert.alert('Success!', `Advanced to Day ${nextDayNumber}! New workout generated.`);
                }
            } catch (error) {
                console.error('Error advancing day:', error);
                Alert.alert('Error', error.message || 'Failed to advance to next day');
            } finally {
                setAdvancingDay(false);
            }
        };

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>30-DAY AI PLAN</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Full Plan', 'Interactive 30-Day calendar coming soon!')}>
                        <Text style={styles.seeAll}>See Plan</Text>
                    </TouchableOpacity>
                </View>

                <GlassCard style={styles.workoutCard}>
                    <View style={{ padding: 20 }}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.dayName}>Day {day.dayNumber}</Text>
                                <Text style={styles.subText}>45 mins • {day.exercises.length} Exercises</Text>
                            </View>
                            <Tag label={day.type} variant="secondary" />
                        </View>

                        <View style={styles.divider} />

                        {day.exercises.map((ex, i) => (
                            <TouchableOpacity key={i} style={styles.exerciseRow} onPress={() => {
                                navigation.navigate('ExerciseDetail', {
                                    exercise: {
                                        ...ex.exercise,
                                        sets: ex.sets,
                                        reps: ex.reps,
                                        _id: ex.exercise._id
                                    },
                                    planId: plan._id,
                                    dayNumber: day.dayNumber,
                                    exerciseIndex: i,
                                    dayExercises: day.exercises
                                });
                            }}>
                                <View style={[
                                    styles.optionIcon,
                                    { backgroundColor: ex.completed ? 'rgba(46, 255, 106, 0.1)' : 'rgba(0, 240, 255, 0.1)' }
                                ]}>
                                    <Ionicons
                                        name={ex.completed ? "checkmark-circle" : "fitness-outline"}
                                        size={16}
                                        color={ex.completed ? COLORS.success : COLORS.primary}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text
                                        style={[
                                            styles.exerciseName,
                                            ex.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {ex.exercise ? ex.exercise.name : 'Unknown Exercise'}
                                    </Text>
                                    <Text style={styles.exerciseMeta}>{ex.sets} sets x {ex.reps} reps</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        ))}

                        {/* Progress indicator */}
                        <View style={{ marginTop: 15, marginBottom: 10 }}>
                            <Text style={{ ...FONTS.body4, color: COLORS.textSecondary, marginBottom: 5 }}>Progress: Day {currentDay} of {totalDays} ({progressPercent}%)</Text>
                            <View style={{ height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, overflow: 'hidden' }}>
                                <View style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: COLORS.primary }} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                            {currentDay > 1 && (
                                <AppButton
                                    title="← Previous"
                                    onPress={handlePreviousDay}
                                    loading={advancingDay}
                                    variant="secondary"
                                    style={{ flex: 1 }}
                                />
                            )}
                            {currentDay < 30 && (
                                <AppButton
                                    title="Next Day →"
                                    onPress={handleNextDay}
                                    loading={advancingDay}
                                    variant="secondary"
                                    style={{ flex: 1 }}
                                />
                            )}
                        </View>

                        <AppButton
                            title="Start Workout"
                            onPress={() => {
                                if (day.exercises.length > 0) {
                                    navigation.navigate('ExerciseDetail', {
                                        exercise: {
                                            ...day.exercises[0].exercise,
                                            sets: day.exercises[0].sets,
                                            reps: day.exercises[0].reps,
                                            _id: day.exercises[0].exercise._id
                                        },
                                        planId: plan._id,
                                        dayNumber: day.dayNumber,
                                        exerciseIndex: 0,
                                        dayExercises: day.exercises
                                    });
                                }
                            }}
                            style={{ marginTop: 25 }}
                        />
                    </View>
                </GlassCard>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />

            {renderHeader()}

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refetch}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
            >

                <TodaysWorkoutCard navigation={navigation} />

                {!plan ? renderNoPlanState() : renderTodayWorkout()}

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 20,
        paddingTop: 10,
    },
    greeting: {
        ...FONTS.h1,
        color: COLORS.white,
    },
    subGreeting: {
        ...FONTS.body4,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    scrollContent: {
        paddingBottom: 100, // Extra space for Bottom Tab integration
    },
    noPlanContainer: {
        marginTop: 20,
    },
    noPlanTitle: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 5,
    },
    noPlanText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginTop: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: SIZES.caption,
        marginBottom: SIZES.marginSmall,
    },
    seeAll: {
        ...FONTS.body4,
        color: COLORS.primary,
    },
    workoutCard: {},
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.paddingSmall,
    },
    dayName: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    subText: {
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 15,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseName: {
        ...FONTS.body3,
        color: COLORS.white,
        fontWeight: '600',
    },
    exerciseMeta: {
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
    },
});

export default HomeScreen;
