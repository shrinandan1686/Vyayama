import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import AppButton from '../components/AppButton';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import GlassCard from '../components/GlassCard';
import ChartComponent from '../components/ChartComponent';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPlan = async () => {
        try {
            const response = await axios.get(`${API_URL}/workout-plans`, {
                headers: { 'x-auth-token': userToken }
            });
            setPlan(response.data);
        } catch (e) {
            console.log('No plan found or error fetching plan');
        }
        setLoading(false);
    };

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchPlan();
        }
    }, [isFocused]);

    if (loading) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </ScreenWrapper>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Hello, Athlete</Text>
                <Text style={styles.subGreeting}>Ready to crush it today?</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
                {/* Placeholder for Profile Tab in case we want direct access here too, but Tab is there */}
                <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
            </TouchableOpacity>
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
        const day = plan.days[0]; // Simplified

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>TODAY'S WORKOUT</Text>
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
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{day.type}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {day.exercises.map((ex, i) => (
                            <TouchableOpacity key={i} style={styles.exerciseRow} onPress={() => {
                                navigation.navigate('ExerciseDetail', {
                                    exercise: {
                                        ...ex.exercise,
                                        sets: ex.sets,
                                        reps: ex.reps,
                                        _id: ex.exercise._id // Maintain ID
                                    },
                                    planId: plan._id,
                                    dayNumber: day.dayNumber,
                                    exerciseIndex: i,
                                    dayExercises: day.exercises
                                });
                            }}>
                                <View style={[styles.optionIcon, { backgroundColor: 'rgba(46, 106, 255, 0.1)' }]}>
                                    <Ionicons name="fitness-outline" size={16} color={COLORS.primary} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.exerciseName} numberOfLines={1}>
                                        {ex.exercise ? ex.exercise.name : 'Unknown Exercise'}
                                    </Text>
                                    <Text style={styles.exerciseMeta}>{ex.sets} sets x {ex.reps} reps</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        ))}

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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Weekly Activity Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>WEEKLY ACTIVITY</Text>
                    <GlassCard>
                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <View>
                                    <Text style={styles.statBig}>1,250</Text>
                                    <Text style={styles.statLabel}>Kcal Burned</Text>
                                </View>
                                <View>
                                    <Text style={styles.statBig}>5</Text>
                                    <Text style={styles.statLabel}>Workouts</Text>
                                </View>
                            </View>
                            <ChartComponent />
                        </View>
                    </GlassCard>
                </View>

                {!plan ? renderNoPlanState() : renderTodayWorkout()}

                {/* Status/Challenge Card */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CHALLENGE</Text>
                    <GlassCard>
                        <LinearGradient colors={[COLORS.surface, '#2E2E2E']} style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.challengeIcon}>
                                    <Text style={{ fontSize: 24 }}>🔥</Text>
                                </View>
                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text style={styles.challengeTitle}>30-Day Streak</Text>
                                    <Text style={styles.challengeSub}>You are on day 12. Keep it up!</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={{ width: '40%', height: '100%' }} />
                            </View>
                        </LinearGradient>
                    </GlassCard>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
    },
    greeting: {
        ...FONTS.h2,
        color: COLORS.white,
    },
    subGreeting: {
        ...FONTS.body4,
        color: COLORS.textSecondary,
    },
    profileButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 12,
        marginBottom: 10,
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
        marginBottom: 15,
    },
    dayName: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    subText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    tag: {
        backgroundColor: 'rgba(198, 255, 0, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    tagText: {
        color: COLORS.secondary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statBig: {
        ...FONTS.h2,
        color: COLORS.white,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    challengeIcon: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeTitle: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    challengeSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        marginTop: 15,
        overflow: 'hidden',
    },
});

export default HomeScreen;

