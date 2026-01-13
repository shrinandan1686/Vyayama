import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import GlassCard from './GlassCard';
import { SIZES } from '../constants/theme';

const WorkoutPlanSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <View>
                    <SkeletonLoader width={150} height={24} style={{ marginBottom: 8 }} />
                    <SkeletonLoader width={200} height={16} />
                </View>
                <SkeletonLoader variant="circle" height={32} />
            </View>

            {/* Workout Cards Skeleton */}
            {[1, 2, 3].map((item) => (
                <GlassCard key={item} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <SkeletonLoader width="60%" height={20} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="80%" height={14} />
                        </View>
                        <SkeletonLoader width={80} height={24} borderRadius={12} />
                    </View>

                    <View style={styles.divider} />

                    {/* Exercise items */}
                    {[1, 2, 3].map((ex) => (
                        <View key={ex} style={styles.exerciseRow}>
                            <SkeletonLoader variant="circle" height={40} style={{ marginRight: 12 }} />
                            <View style={{ flex: 1 }}>
                                <SkeletonLoader width="70%" height={16} style={{ marginBottom: 6 }} />
                                <SkeletonLoader width="50%" height={12} />
                            </View>
                        </View>
                    ))}
                </GlassCard>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.marginSection,
    },
    card: {
        padding: SIZES.padding,
        marginBottom: SIZES.margin,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.paddingSmall,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: SIZES.paddingSmall,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.marginSmall,
    },
});

export default WorkoutPlanSkeleton;
