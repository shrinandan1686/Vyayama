import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import ScreenWrapper from '../components/ScreenWrapper';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

const OnboardingScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState('');
    const [loading, setLoading] = useState(false);

    // Hardcoded for now, could be dropdowns later
    const [goal, setGoal] = useState('General Fitness');
    const [experienceLevel, setExperienceLevel] = useState('Beginner');

    const submitProfile = async () => {
        if (!age || !weight || !height || !daysPerWeek) {
            Alert.alert('Missing Fields', 'Please fill in all fields to generate your plan.');
            return;
        }

        setLoading(true);
        try {
            // 1. Update Profile
            await axios.put(`${API_URL}/users/profile`, {
                age: parseInt(age),
                weight: parseFloat(weight),
                height: parseFloat(height),
                goal,
                experienceLevel,
                daysPerWeek: parseInt(daysPerWeek)
            }, {
                headers: { 'x-auth-token': userToken }
            });

            // 2. Mock Plan Generation / Navigate
            Alert.alert('Success', 'Profile updated! Your plan is being generated.');
            navigation.goBack();
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
        setLoading(false);
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Let's Get Started</Text>
                        <Text style={styles.subtitle}>Help us tailor a workout plan just for you</Text>
                    </View>

                    <View style={styles.form}>
                        <AppInput
                            label="Age"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            placeholder="e.g. 25"
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <AppInput
                                    label="Weight (kg)"
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="numeric"
                                    placeholder="e.g. 70"
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <AppInput
                                    label="Height (cm)"
                                    value={height}
                                    onChangeText={setHeight}
                                    keyboardType="numeric"
                                    placeholder="e.g. 175"
                                />
                            </View>
                        </View>

                        <AppInput
                            label="Days per week"
                            value={daysPerWeek}
                            onChangeText={setDaysPerWeek}
                            keyboardType="numeric"
                            placeholder="e.g. 4"
                        />

                        {/* Future: Add Selectors for Goal and Experience */}

                        <View style={{ height: 20 }} />

                        <AppButton
                            title="GENERATE PLAN"
                            onPress={submitProfile}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        marginBottom: 10,
    },
    subtitle: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default OnboardingScreen;

