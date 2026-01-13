import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const ChartComponent = ({ data = [] }) => {
    // If no data, show empty bars
    const chartData = data.length > 0 ? data.map(d => {
        const dayLabel = d.day?.substring(0, 1) || '-'; // First letter of day
        const maxCalories = 500; // Max calories for normalization
        const normalizedValue = Math.min(d.calories / maxCalories, 1); // 0-1 range

        return {
            label: dayLabel,
            value: normalizedValue,
            calories: d.calories || 0
        };
    }) : [
        { label: 'M', value: 0, calories: 0 },
        { label: 'T', value: 0, calories: 0 },
        { label: 'W', value: 0, calories: 0 },
        { label: 'T', value: 0, calories: 0 },
        { label: 'F', value: 0, calories: 0 },
        { label: 'S', value: 0, calories: 0 },
        { label: 'S', value: 0, calories: 0 },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.chartRow}>
                {chartData.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                        <View style={styles.barTrack}>
                            <LinearGradient
                                colors={[COLORS.secondary, COLORS.primary]}
                                style={[styles.barFill, { height: item.value > 0 ? `${Math.max(item.value * 100, 10)}%` : '0%' }]}
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
