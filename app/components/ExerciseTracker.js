import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from './GlassCard';
import AppInput from './AppInput';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const ExerciseTracker = ({
    exerciseName,
    setNumber,
    totalSets,
    targetRepsMin,
    targetRepsMax,
    weight,
    reps,
    notes,
    onChangeWeight,
    onChangeReps,
    onChangeNotes,
    completedSetsCount,
    remainingSetsCount
}) => {
    const repsLabel = targetRepsMin === targetRepsMax
        ? `${targetRepsMin} reps`
        : `${targetRepsMin}–${targetRepsMax} reps`;

    return (
        <GlassCard style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.exerciseName}>{exerciseName}</Text>
                <Text style={styles.setProgress}>Set {setNumber} / {totalSets}</Text>

                <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Target</Text>
                    <Text style={styles.targetValue}>{repsLabel}</Text>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                        <AppInput
                            label="Weight"
                            value={weight}
                            onChangeText={onChangeWeight}
                            keyboardType="numeric"
                            placeholder="kg"
                        />
                    </View>
                    <View style={styles.inputHalf}>
                        <AppInput
                            label="Actual Reps"
                            value={reps}
                            onChangeText={onChangeReps}
                            keyboardType="numeric"
                            placeholder="reps"
                        />
                    </View>
                </View>

                <AppInput
                    label="Notes (optional)"
                    value={notes}
                    onChangeText={onChangeNotes}
                    placeholder="How did that feel?"
                />

                <View style={styles.checkboxRow}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checkboxLabel}>Completed after saving this set</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Completed: {completedSetsCount}</Text>
                    <Text style={styles.summaryText}>Remaining: {remainingSetsCount}</Text>
                    <Text style={styles.summaryText}>Total: {totalSets}</Text>
                </View>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: { marginTop: SIZES.marginSection },
    content: { padding: SIZES.padding },
    exerciseName: { ...FONTS.h2, color: COLORS.white, marginBottom: 4 },
    setProgress: { ...FONTS.body3, color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.marginSmall },
    targetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radiusSmall,
        padding: SIZES.paddingMini,
        marginBottom: SIZES.marginSection
    },
    targetLabel: { ...FONTS.body4, color: COLORS.textSecondary },
    targetValue: { ...FONTS.body3, color: COLORS.white, fontWeight: '700' },
    inputRow: { flexDirection: 'row', gap: 12 },
    inputHalf: { flex: 1 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: SIZES.marginSmall },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginRight: 10
    },
    checkboxLabel: { ...FONTS.body4, color: COLORS.textSecondary },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SIZES.marginSmall,
        paddingTop: SIZES.marginSmall,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderDark
    },
    summaryText: { ...FONTS.body4, color: COLORS.textSecondary }
});

export default ExerciseTracker;
