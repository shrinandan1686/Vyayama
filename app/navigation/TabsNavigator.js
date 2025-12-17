import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { BlurView } from 'expo-blur';

// Placeholder for a "Plans/Activity" screen if we want 3 tabs
// or we can just stick to Home and Profile for now, but 3 looks better.
// Let's create a dummy "ActivityScreen" or reuse Home for now.
import ChatScreen from '../screens/ChatScreen';

// const ActivityScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

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
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.surface, opacity: 0.95 }]} />
                ),
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="home" label="Home" />
                    )
                }}
            />
            <Tab.Screen
                name="ChatTab"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="chatbubbles" label="AI Coach" />
                    )
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="person" label="Profile" />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

const TabIcon = ({ focused, icon, label }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 10 : 0 }}>
            <View style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused
            ]}>
                <Ionicons
                    name={focused ? icon : `${icon}-outline`}
                    size={24}
                    color={focused ? COLORS.white : COLORS.textSecondary}
                />
            </View>
            {focused && <View style={styles.dot} />}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 70,
        borderRadius: 35,
        borderTopWidth: 0,
        elevation: 0,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
                backgroundColor: COLORS.surface, // Fallback if blur doesn't work well
            }
        }),
        overflow: 'hidden', // for blur to respect border radius on android sometimes needs care, but iOS handles it.
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerFocused: {
        backgroundColor: 'rgba(46, 106, 255, 0.2)', // Light primary,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
        marginTop: 4,
    }
});

export default TabsNavigator;
