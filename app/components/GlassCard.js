import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SIZES, COLORS } from '../constants/theme';

const GlassCard = memo(({ children, style, intensity = 20 }) => {
    // Android Support for BlurView is limited in Expo Go sometimes, 
    // so we use a semi-transparent gradient fallback if needed, 
    // but Expo Blur works reasonably well on modern Android versions.
    // For a consistent "Glass" look that works everywhere, a gradient with opacity is safer.

    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Optional real blur if on iOS */}
            {Platform.OS === 'ios' && (
                <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
            )}

            <View style={styles.borderOverlay} />

            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
});

GlassCard.displayName = 'GlassCard';

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        position: 'relative',
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1,
    },
    content: {
        zIndex: 2,
    }
});

export default GlassCard;
