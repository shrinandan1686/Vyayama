import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from './GlassCard';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useRestTimer } from '../hooks/useRestTimer';

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const RestTimer = ({ defaultSeconds, onComplete, onSkip }) => {
    const { secondsLeft, isPaused, finished, start, pause, resume, skip, adjust } = useRestTimer(defaultSeconds);

    useEffect(() => {
        start(defaultSeconds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (finished) {
            onComplete && onComplete();
        }
    }, [finished, onComplete]);

    const handleSkip = () => {
        skip();
        (onSkip || onComplete) && (onSkip || onComplete)();
    };

    return (
        <GlassCard style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.label}>REST</Text>
                <Text style={styles.time}>{formatTime(secondsLeft)}</Text>

                <View style={styles.adjustRow}>
                    <TouchableOpacity style={styles.adjustButton} onPress={() => adjust(-30)}>
                        <Text style={styles.adjustText}>-30s</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.adjustButton} onPress={() => adjust(30)}>
                        <Text style={styles.adjustText}>+30s</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.controlsRow}>
                    <TouchableOpacity style={styles.iconButton} onPress={isPaused ? resume : pause}>
                        <Ionicons name={isPaused ? 'play' : 'pause'} size={28} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: { marginTop: SIZES.marginSection },
    content: { padding: SIZES.padding, alignItems: 'center' },
    label: { ...FONTS.h4, color: COLORS.textSecondary, letterSpacing: 2, marginBottom: 10 },
    time: { fontSize: 56, fontWeight: '800', color: COLORS.white, marginBottom: SIZES.marginSection },
    adjustRow: { flexDirection: 'row', gap: 12, marginBottom: SIZES.marginSection },
    adjustButton: {
        paddingHorizontal: SIZES.paddingSmall,
        paddingVertical: 8,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.surfaceLight
    },
    adjustText: { ...FONTS.body4, color: COLORS.text, fontWeight: '600' },
    controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    iconButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    skipButton: { paddingHorizontal: SIZES.paddingSmall, paddingVertical: 12 },
    skipText: { ...FONTS.body3, color: COLORS.textSecondary, fontWeight: '600' }
});

export default RestTimer;
