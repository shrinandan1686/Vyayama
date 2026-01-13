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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
        height: 75,
        borderRadius: 37.5,
        borderTopWidth: 0,
        elevation: 0,
        paddingTop: 10,
        paddingBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
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
        backgroundColor: 'rgba(46, 106, 255, 0.2)',
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
