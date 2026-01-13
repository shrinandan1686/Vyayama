import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

const SkeletonLoader = ({
    width = '100%',
    height = 20,
    borderRadius = SIZES.radius,
    style,
    variant = 'rectangle' // 'rectangle', 'circle', 'text'
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const containerStyle = [
        styles.container,
        {
            width: variant === 'circle' ? height : width,
            height,
            borderRadius: variant === 'circle' ? height / 2 : borderRadius,
        },
        style,
    ];

    return (
        <Animated.View style={[containerStyle, { opacity }]}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surfaceLight,
        overflow: 'hidden',
    },
});

export default SkeletonLoader;
