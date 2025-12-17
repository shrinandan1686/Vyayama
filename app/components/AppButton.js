
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const AppButton = ({
    title,
    onPress,
    loading = false,
    variant = 'primary', // primary, secondary, text
    style
}) => {

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                disabled={loading}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.text}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (variant === 'secondary') {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                disabled={loading}
                style={[styles.container, styles.secondaryContainer, style]}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                ) : (
                    <Text style={[styles.text, { color: COLORS.primary }]}>{title}</Text>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            disabled={loading}
            style={[styles.textContainer, style]}
        >
            <Text style={[styles.textLink, { color: COLORS.textSecondary }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        marginVertical: 10,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        ...FONTS.button,
        color: COLORS.white,
    },
    textLink: {
        fontSize: 14,
        fontWeight: '500',
    }
});

export default AppButton;
