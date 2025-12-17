
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const AppInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    label,
    error,
    keyboardType = 'default'
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                isFocused && styles.focused,
                error && styles.errorBorder
            ]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        ...FONTS.body4,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    inputWrapper: {
        height: 50,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.transparent,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    focused: {
        borderColor: COLORS.primary,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    input: {
        ...FONTS.body3,
        color: COLORS.text,
        height: '100%',
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
    }
});

export default AppInput;
