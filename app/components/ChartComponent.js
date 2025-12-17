import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const ChartComponent = () => {
    // Mock Data for "Weekly Activity"
    const data = [
        { label: 'M', value: 0.3 },
        { label: 'T', value: 0.5 },
        { label: 'W', value: 0.8 },
        { label: 'T', value: 0.4 },
        { label: 'F', value: 0.9 },
        { label: 'S', value: 0.6 },
        { label: 'S', value: 0.2 },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.chartRow}>
                {data.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                        <View style={styles.barTrack}>
                            <LinearGradient
                                colors={[COLORS.secondary, COLORS.primary]} // Lime to Blue gradient
                                style={[styles.barFill, { height: `${item.value * 100}%` }]}
                            />
                        </View>
                        <Text style={styles.label}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        width: 8,
        height: '100%',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 4,
    },
    label: {
        marginTop: 10,
        ...FONTS.body5,
        color: COLORS.textSecondary,
    },
});

export default ChartComponent;
