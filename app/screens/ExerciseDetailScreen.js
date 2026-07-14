import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { useApi } from '../hooks/useApi';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Tag from '../components/Tag';

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { exercise, planId, dayNumber, exerciseIndex, dayExercises } = route.params;
    const api = useApi();
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlternatives, setShowAlternatives] = useState(false);

    const openVideo = () => {
        const url = exercise.youtubeUrl || exercise.videoLink;
        if (url) {
            Linking.openURL(url);
        } else {
            Alert.alert('No Video', 'No video link available for this exercise.');
        }
    };

    const markComplete = async (exId = exercise._id) => {
        if (!planId || !dayNumber) {
            Alert.alert('Error', 'Missing plan context');
            return;
        }

        setLoading(true);
        try {
            await api.updateExerciseProgress(planId, dayNumber, exercise._id, {
                completed: true,
                alternativeUsed: exId !== exercise._id
            });
            setCompleted(true);

            // If there's a next exercise, navigate to it after a short delay
            if (dayExercises && exerciseIndex < dayExercises.length - 1) {
                setTimeout(() => {
                    const nextIndex = exerciseIndex + 1;
                    const nextEx = dayExercises[nextIndex];
                    navigation.replace('ExerciseDetail', {
                        exercise: {
                            ...nextEx.exercise,
                            sets: nextEx.sets,
                            reps: nextEx.reps,
                            _id: nextEx.exercise._id
                        },
                        planId,
                        dayNumber,
                        exerciseIndex: nextIndex,
                        dayExercises
                    });
                }, 1000);
            } else {
                // Last exercise - show completion message
                Alert.alert('Workout Complete!', 'Great job finishing all exercises!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Failed to mark complete');
        }
        setLoading(false);
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header / Video Placeholder */}
                <TouchableOpacity style={styles.videoPlaceholder} onPress={openVideo} activeOpacity={0.9}>
                    <LinearGradient
                        colors={[COLORS.surfaceLight, COLORS.surface]}
                        style={styles.videoGradient}
                    >
                        <View style={styles.playButton}>
                            <View style={styles.playIcon} />
                        </View>
                        <Text style={styles.watchText}>Watch Tutorial</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Back Button Overlay */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>{exercise.name}</Text>

                    <View style={styles.tagsRow}>
                        <Tag label={exercise.category} variant="primary" />
                        <Tag label={exercise.difficulty} variant="secondary" style={{ marginLeft: SIZES.marginSmall }} />
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>SETS</Text>
                            <Text style={styles.infoValue}>{exercise.sets || '-'}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>REPS</Text>
                            <Text style={styles.infoValue}>{exercise.reps || '-'}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>REST</Text>
                            <Text style={styles.infoValue}>60s</Text>
                        </View>
                    </View>

                    {showAlternatives && exercise.alternatives && exercise.alternatives.length > 0 && (
                        <View style={styles.alternativesSection}>
                            <Text style={styles.sectionTitleAlt}>ALTERNATIVES</Text>
                            {exercise.alternatives.map((alt, i) => (
                                <View key={i} style={styles.altCard}>
                                    <View>
                                        <Text style={styles.altName}>{alt.name}</Text>
                                        <Text style={styles.altEquip}>{alt.equipment}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', display: 'flex' }}>
                                        {alt.youtubeUrl && (
                                            <TouchableOpacity onPress={() => Linking.openURL(alt.youtubeUrl)} style={styles.iconButton}>
                                                <Text style={{ fontSize: 18 }}>🎥</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity onPress={() => markComplete(alt._id)} style={[styles.iconButton, { marginLeft: 10, backgroundColor: COLORS.primary }]}>
                                            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>DO</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>EQUIPMENT</Text>
                    <Text style={styles.bodyText}>{exercise.equipment || 'No equipment listed'}</Text>

                    <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
                    {exercise.instructions && exercise.instructions.map((inst, index) => (
                        <View key={index} style={styles.instructionRow}>
                            <Text style={styles.instructionNumber}>{index + 1}</Text>
                            <Text style={styles.instructionText}>{inst}</Text>
                        </View>
                    ))}

                    <View style={{ height: 30 }} />

                    <AppButton
                        title={completed ? "COMPLETED" : "MARK AS DONE"}
                        onPress={() => markComplete()}
                        disabled={completed}
                        loading={loading}
                        variant={completed ? 'secondary' : 'primary'}
                    />

                    {/* Next Workout Button */}
                    {dayExercises && exerciseIndex < dayExercises.length - 1 && (
                        <AppButton
                            title="Next Workout"
                            onPress={() => {
                                const nextIndex = exerciseIndex + 1;
                                const nextEx = dayExercises[nextIndex];
                                navigation.replace('ExerciseDetail', {
                                    exercise: {
                                        ...nextEx.exercise,
                                        sets: nextEx.sets,
                                        reps: nextEx.reps,
                                        _id: nextEx.exercise._id
                                    },
                                    planId,
                                    dayNumber,
                                    exerciseIndex: nextIndex,
                                    dayExercises
                                });
                            }}
                            variant="primary"
                            style={{ marginTop: 15, backgroundColor: COLORS.secondary }}
                        />
                    )}

                    <AppButton
                        title={showAlternatives ? "Hide Alternatives" : "Equipment Busy? Find Alternative"}
                        onPress={() => {
                            if (!exercise.alternatives || exercise.alternatives.length === 0) {
                                Alert.alert('Info', 'No specific alternatives listed, keep it simple!');
                            } else {
                                setShowAlternatives(!showAlternatives);
                            }
                        }}
                        variant="text"
                        style={{ marginTop: 10 }}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 20,
    },
    videoPlaceholder: {
        height: 200,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        marginBottom: 20,
        marginTop: 10,
    },
    videoGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    playIcon: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 0,
        borderBottomWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: COLORS.white,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: 5,
    },
    watchText: {
        ...FONTS.body4,
        color: COLORS.white,
    },
    content: {
        paddingHorizontal: 0,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        marginBottom: 10,
    },
    tagsRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tag: {
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        paddingHorizontal: SIZES.paddingMini,
        paddingVertical: 5,
        borderRadius: 20,
    },
    tagText: {
        ...FONTS.body4,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 20,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: SIZES.caption,
        color: COLORS.textSecondary,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    infoValue: {
        ...FONTS.h2,
        color: COLORS.white,
    },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.textSecondary,
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold',
    },
    bodyText: {
        ...FONTS.body3,
        color: COLORS.text,
        marginBottom: 20,
    },
    instructionRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    instructionNumber: {
        width: 24,
        height: 24,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surfaceLight,
        textAlign: 'center',
        lineHeight: 24,
        color: COLORS.primary,
        fontSize: SIZES.caption,
        fontWeight: 'bold',
        marginRight: SIZES.marginSmall,
        marginTop: 2,
    },
    instructionText: {
        flex: 1,
        ...FONTS.body3,
        color: COLORS.text,
        lineHeight: 22,
    },
    alternativesSection: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    sectionTitleAlt: {
        ...FONTS.h4,
        color: COLORS.error,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    altCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    altName: {
        color: COLORS.white,
        ...FONTS.body3,
        fontWeight: 'bold',
    },
    altEquip: {
        color: COLORS.textSecondary,
        fontSize: SIZES.caption,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default ExerciseDetailScreen;
