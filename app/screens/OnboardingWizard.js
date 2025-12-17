import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const STEPS = [
    { id: 1, title: "Physical Details" },
    { id: 2, title: "Experience" },
    { id: 3, title: "Goals" },
    { id: 4, title: "Gym Reality" },
    { id: 5, title: "Summary" }
];

const MultiSelectOption = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.optionChip, selected && styles.optionChipSelected]}
        onPress={onPress}
    >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

const RadioOption = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.radioOption, selected && styles.radioOptionSelected]}
        onPress={onPress}
    >
        <Ionicons
            name={selected ? "radio-button-on" : "radio-button-off"}
            size={20}
            color={selected ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.radioText, selected && styles.radioTextSelected]}>{label}</Text>
    </TouchableOpacity>
);

const OnboardingWizard = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1
        age: '',
        gender: '',
        height: '',
        weight: '',
        // Step 2
        experienceLevel: 'Beginner', // Default
        gymComfort: 'Somewhat comfortable',
        gymConfidence: 'Medium',
        // Step 3
        goal: 'General Fitness',
        bodyType: 'Not sure',
        focusAreas: [],
        // Step 4
        daysPerWeek: '',
        averageWorkoutDuration: '60',
        equipment: ['Machines', 'Dumbbells'], // Default common items
        gymCrowdLevel: 'Moderately crowded',
        injuries: '',
        // Step 5 - Summary
    });

    const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
    const toggleArrayItem = (key, item) => {
        setFormData(prev => {
            const list = prev[key] || [];
            if (list.includes(item)) return { ...prev, [key]: list.filter(i => i !== item) };
            return { ...prev, [key]: [...list, item] };
        });
    };

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Update Profile
            await axios.put(`${API_URL}/users/profile`, {
                ...formData,
                daysPerWeek: parseInt(formData.daysPerWeek) || 3,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                averageWorkoutDuration: parseInt(formData.averageWorkoutDuration)
            }, {
                headers: { 'x-auth-token': userToken }
            });

            // 2. Generate Plan
            await axios.post(`${API_URL}/workout-plans`, {}, {
                headers: { 'x-auth-token': userToken }
            });

            navigation.replace('MainTabs');

        } catch (error) {
            console.error('Plan generation failed:', error);
            const msg = error.response && error.response.data ? error.response.data : error.message;
            Alert.alert('Error', 'Failed to create plan: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            {STEPS.map((step, index) => (
                <View key={step.id} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.stepDot, currentStep >= step.id && styles.stepDotActive]}>
                        <Text style={styles.stepNum}>{step.id}</Text>
                    </View>
                    {index < STEPS.length - 1 && (
                        <View style={[styles.stepLine, currentStep > step.id && styles.stepLineActive]} />
                    )}
                </View>
            ))}
        </View>
    );

    const renderStep1 = () => (
        <View>
            <Text style={styles.stepTitle}>Physical Details</Text>
            <Text style={styles.stepSub}>Let's calibrate your baseline.</Text>

            <View style={styles.inputGroup}>
                <AppInput label="Age" value={formData.age} onChangeText={t => updateForm('age', t)} keyboardType="numeric" placeholder="e.g. 25" />
                <AppInput label="Weight (kg)" value={formData.weight} onChangeText={t => updateForm('weight', t)} keyboardType="numeric" placeholder="e.g. 70" />
                <AppInput label="Height (cm)" value={formData.height} onChangeText={t => updateForm('height', t)} keyboardType="numeric" placeholder="e.g. 175" />
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.rowWrap}>
                {['Male', 'Female', 'Prefer not to say'].map(opt => (
                    <RadioOption key={opt} label={opt} selected={formData.gender === opt} onPress={() => updateForm('gender', opt)} />
                ))}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View>
            <Text style={styles.stepTitle}>Experience & Comfort</Text>
            <Text style={styles.stepSub}>How confident are you in the gym?</Text>

            <Text style={styles.label}>Experience Level</Text>
            {['Beginner', 'Intermediate', 'Advanced'].map(opt => (
                <RadioOption key={opt} label={opt} selected={formData.experienceLevel === opt} onPress={() => updateForm('experienceLevel', opt)} />
            ))}

            <Text style={[styles.label, { marginTop: 20 }]}>Gym Comfort</Text>
            {['Very uncomfortable', 'Somewhat comfortable', 'Confident'].map(opt => (
                <RadioOption key={opt} label={opt} selected={formData.gymComfort === opt} onPress={() => updateForm('gymComfort', opt)} />
            ))}
        </View>
    );

    const renderStep3 = () => (
        <View>
            <Text style={styles.stepTitle}>Goals & Focus</Text>
            <Text style={styles.stepSub}>What are we building towards?</Text>

            <Text style={styles.label}>Primary Goal</Text>
            {['Fat Loss', 'Muscle Gain', 'Strength', 'General Fitness'].map(opt => (
                <RadioOption key={opt} label={opt} selected={formData.goal === opt} onPress={() => updateForm('goal', opt)} />
            ))}

            <Text style={[styles.label, { marginTop: 20 }]}>Focus Areas (Select all that apply)</Text>
            <View style={styles.rowWrap}>
                {['Chest', 'Back', 'Legs', 'Arms', 'Core', 'Full Body'].map(opt => (
                    <MultiSelectOption
                        key={opt}
                        label={opt}
                        selected={formData.focusAreas.includes(opt)}
                        onPress={() => toggleArrayItem('focusAreas', opt)}
                    />
                ))}
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View>
            <Text style={styles.stepTitle}>Gym Reality Check</Text>
            <Text style={styles.stepSub}>Let's build a realistic schedule.</Text>

            <AppInput label="Days per week available" value={formData.daysPerWeek} onChangeText={t => updateForm('daysPerWeek', t)} keyboardType="numeric" placeholder="e.g. 3, 4, 5" />
            <AppInput label="Avg Workout Duration (min)" value={formData.averageWorkoutDuration} onChangeText={t => updateForm('averageWorkoutDuration', t)} keyboardType="numeric" placeholder="e.g. 60" />

            <Text style={[styles.label, { marginTop: 20 }]}>Equipment Available</Text>
            <View style={styles.rowWrap}>
                {['Barbells', 'Dumbbells', 'Machines', 'Cables', 'Resistance Bands', 'Bodyweight'].map(opt => (
                    <MultiSelectOption
                        key={opt}
                        label={opt}
                        selected={formData.equipment.includes(opt)}
                        onPress={() => toggleArrayItem('equipment', opt)}
                    />
                ))}
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Crowd Level</Text>
            {['Mostly free', 'Moderately crowded', 'Always crowded'].map(opt => (
                <RadioOption key={opt} label={opt} selected={formData.gymCrowdLevel === opt} onPress={() => updateForm('gymCrowdLevel', opt)} />
            ))}
        </View>
    );

    const renderStep5 = () => (
        <View>
            <Text style={styles.stepTitle}>Summary</Text>
            <Text style={styles.stepSub}>Ready to generate your plan?</Text>

            <View style={styles.summaryCard}>
                <SummaryItem label="Goal" value={formData.goal} />
                <SummaryItem label="Experience" value={formData.experienceLevel} />
                <SummaryItem label="Commitment" value={`${formData.daysPerWeek} days / week`} />
                <SummaryItem label="Focus" value={formData.focusAreas.join(', ') || 'All Around'} />
                <SummaryItem label="Duration" value={`${formData.averageWorkoutDuration} mins`} />
            </View>

            <Text style={styles.note}>
                Our AI will now construct a 30-day plan tailored to your body type and gym conditions, ensuring alternatives for busy equipment.
            </Text>
        </View>
    );

    const SummaryItem = ({ label, value }) => (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={styles.summaryValue}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={{ padding: 10 }}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Build Your Plan</Text>
                <View style={{ width: 44 }} />
            </View>

            {renderProgressBar()}

            <ScrollView contentContainerStyle={styles.content}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
            </ScrollView>

            <View style={styles.footer}>
                {currentStep > 1 && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                )}

                <AppButton
                    title={currentStep === 5 ? "Generate 30-Day Plan" : "Next Step"}
                    onPress={currentStep === 5 ? handleSubmit : handleNext}
                    loading={loading}
                    style={{ flex: 1, marginLeft: currentStep > 1 ? 15 : 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    headerTitle: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepDotActive: {
        backgroundColor: COLORS.primary,
    },
    stepNum: {
        ...FONTS.body4,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: COLORS.surfaceLight,
        marginHorizontal: 5,
    },
    stepLineActive: {
        backgroundColor: COLORS.primary,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    stepTitle: {
        ...FONTS.h1,
        color: COLORS.white,
        marginBottom: 5,
    },
    stepSub: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginBottom: 30,
    },
    label: {
        ...FONTS.h4,
        color: COLORS.text,
        marginBottom: 10,
    },
    rowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionChip: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceLight,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    optionChipSelected: {
        backgroundColor: 'rgba(46, 106, 255, 0.2)',
        borderColor: COLORS.primary,
    },
    optionText: {
        color: COLORS.textSecondary,
        ...FONTS.body4,
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    radioOptionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(46, 106, 255, 0.1)',
    },
    radioText: {
        marginLeft: 10,
        color: COLORS.text,
        ...FONTS.body3,
    },
    radioTextSelected: {
        color: COLORS.white,
    },
    footer: {
        padding: 20,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.surfaceLight,
    },
    backButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: COLORS.textSecondary,
        ...FONTS.button,
    },
    summaryCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 20,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 8,
    },
    summaryLabel: {
        color: COLORS.textSecondary,
        ...FONTS.body4,
    },
    summaryValue: {
        color: COLORS.white,
        ...FONTS.h4,
    },
    note: {
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
});

export default OnboardingWizard;
