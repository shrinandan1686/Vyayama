import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { COLORS } from '../constants/theme';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, style }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, style, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});

export default ScreenWrapper;
