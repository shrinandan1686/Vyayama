import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import ExerciseTracker from '../components/ExerciseTracker';
import RestTimer from '../components/RestTimer';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useApi } from '../hooks/useApi';

const WorkoutSessionScreen = ({ route, navigation }) => {
    const { session: initialSession } = route.params;
    const api = useApi();

    const [session, setSession] = useState(initialSession);
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [setIndex, setSetIndex] = useState(0);
    const [phase, setPhase] = useState('tracking'); // 'tracking' | 'resting'
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const exercises = session.exercises;
    const currentExercise = exercises[exerciseIndex];
    const currentSet = currentExercise?.sets?.[setIndex];

    if (!currentExercise || !currentSet) {
        return null;
    }

    const completedSetsCount = currentExercise.sets.filter((s) => s.completed).length;
    const remainingSetsCount = currentExercise.sets.length - completedSetsCount;

    const handleBack = () => {
        Alert.alert(
            'Leave Workout?',
            'Your progress so far has been saved. You can resume later from Workout History.',
            [
                { text: 'Stay', style: 'cancel' },
                { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() }
            ]
        );
    };

    const resetSetInputs = () => {
        setWeight('');
        setReps('');
        setNotes('');
        setPhase('tracking');
    };

    const advanceToNext = () => {
        const isLastSetOfExercise = setIndex >= currentExercise.sets.length - 1;
        if (!isLastSetOfExercise) {
            setSetIndex(setIndex + 1);
        } else {
            setExerciseIndex(exerciseIndex + 1);
            setSetIndex(0);
        }
        resetSetInputs();
    };

    const handleCompleteSet = async () => {
        if (!reps) {
            Alert.alert('Missing reps', 'Enter how many reps you completed.');
            return;
        }

        try {
            setSaving(true);
            const updated = await api.updateWorkoutSet(session._id, exerciseIndex, setIndex, {
                weight: weight ? parseFloat(weight) : null,
                reps: parseInt(reps, 10),
                notes,
                completed: true
            });
            setSession(updated);

            const isLastSetOfExercise = setIndex >= currentExercise.sets.length - 1;
            const isLastExercise = exerciseIndex >= exercises.length - 1;

            if (isLastSetOfExercise && isLastExercise) {
                navigation.replace('WorkoutComplete', { session: updated });
            } else {
                setPhase('resting');
            }
        } catch (e) {
            console.error('Error saving set:', e);
            Alert.alert('Error', 'Failed to save this set. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{session.templateName}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {phase === 'tracking' ? (
                    <>
                        <ExerciseTracker
                            exerciseName={currentExercise.exercise.name}
                            setNumber={setIndex + 1}
                            totalSets={currentExercise.sets.length}
                            targetRepsMin={currentExercise.targetRepsMin}
                            targetRepsMax={currentExercise.targetRepsMax}
                            weight={weight}
                            reps={reps}
                            notes={notes}
                            onChangeWeight={setWeight}
                            onChangeReps={setReps}
                            onChangeNotes={setNotes}
                            completedSetsCount={completedSetsCount}
                            remainingSetsCount={remainingSetsCount}
                        />
                        <AppButton
                            title="Complete Current Set"
                            onPress={handleCompleteSet}
                            loading={saving}
                            style={{ marginTop: SIZES.marginSection }}
                        />
                    </>
                ) : (
                    <RestTimer
                        defaultSeconds={currentExercise.restSeconds}
                        onComplete={advanceToNext}
                    />
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    headerTitle: { ...FONTS.h3, color: COLORS.white },
    scrollContent: { paddingBottom: 40 }
});

export default WorkoutSessionScreen;
