import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { BlurView } from 'expo-blur';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ?
                        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" /> :
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.surface, opacity: 0.97 }]} />
                ),
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="home" />
                    )
                }}
            />
            <Tab.Screen
                name="ChatTab"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="chatbubbles" />
                    )
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="person" />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

const TabIcon = ({ focused, icon }) => {
    if (!focused) {
        return (
            <View style={styles.iconContainer}>
                <Ionicons name={`${icon}-outline`} size={24} color={COLORS.textSecondary} />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainerFocused}
        >
            <Ionicons name={icon} size={22} color={COLORS.white} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 72,
        borderRadius: 36,
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        elevation: 0,
        paddingTop: 10,
        paddingBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            },
            android: {
                elevation: 10,
                backgroundColor: COLORS.surface,
            }
        }),
        overflow: 'hidden',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerFocused: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 6,
    },
});

export default TabsNavigator;
