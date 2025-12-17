import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

const ProfileScreen = ({ navigation }) => {
    const { userToken, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fix: Use API_URL constant instead of hardcoded localhost
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers: { 'x-auth-token': userToken }
                });
                setUser(response.data);
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </ScreenWrapper>
        );
    }

    if (!user) {
        return (
            <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.error }}>Failed to load profile</Text>
                <AppButton title="Retry" onPress={() => setLoading(true)} style={{ width: 100, marginTop: 20 }} />
            </ScreenWrapper>
        );
    }

    const renderStatItem = (label, value) => (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value || '-'}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.name ? user.name[0].toUpperCase() : 'U'}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PHYSICAL STATS</Text>
                    <View style={styles.statsGrid}>
                        {renderStatItem('Weight', `${user.fitnessProfile?.weight} kg`)}
                        {renderStatItem('Height', `${user.fitnessProfile?.height} cm`)}
                        {renderStatItem('Age', `${user.fitnessProfile?.age}`)}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GOALS</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Goal</Text>
                        <Text style={styles.infoText}>{user.fitnessProfile?.goal}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Experience</Text>
                        <Text style={styles.infoText}>{user.fitnessProfile?.experienceLevel}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Commitment</Text>
                        <Text style={styles.infoText}>{user.fitnessProfile?.daysPerWeek} days/week</Text>
                    </View>
                </View>

                <View style={[styles.section, { borderColor: COLORS.primary, borderWidth: 1 }]}>
                    <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>ACTIVE PLAN</Text>
                    <Text style={{ color: COLORS.white, ...FONTS.body3, marginBottom: 10 }}>
                        30-Day AI Personalized Plan
                    </Text>
                    <AppButton
                        title="Regenerate Plan"
                        onPress={() => {
                            // Simple alert for now, ideally confirm then navigate to Onboarding
                            navigation.replace('Onboarding');
                        }}
                        variant="text"
                        style={{ height: 40 }}
                    />
                </View>

                <View style={{ flex: 1 }} />

                <AppButton
                    title="LOGOUT"
                    onPress={logout}
                    variant="secondary"
                    style={{ marginTop: 40, borderColor: COLORS.error }}
                />
                {/* Hacky way to style logout text red if my component supported it, but outlines are fine */}

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 20,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    userName: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 5,
    },
    userEmail: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    section: {
        marginTop: 30,
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 20,
    },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.textSecondary,
        marginBottom: 20,
        fontSize: 12,
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 5,
    },
    statLabel: {
        ...FONTS.body4,
        color: COLORS.textSecondary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    infoText: {
        ...FONTS.body3,
        color: COLORS.white,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceLight,
        marginVertical: 5,
    },
});

export default ProfileScreen;

