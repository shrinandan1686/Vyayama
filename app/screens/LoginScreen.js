import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ScreenWrapper from '../components/ScreenWrapper';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <ScreenWrapper>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
                    </View>

                    <View style={styles.form}>
                        <AppInput
                            label="Email"
                            value={email}
                            placeholder="user@example.com"
                            onChangeText={text => setEmail(text)}
                            keyboardType="email-address"
                        />
                        <AppInput
                            label="Password"
                            value={password}
                            placeholder="Enter your password"
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />

                        <View style={{ height: 20 }} />

                        <AppButton
                            title="LOGIN"
                            onPress={handleLogin}
                            loading={loading}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.link}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        ...FONTS.largeTitle,
        color: COLORS.white,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        ...FONTS.body4,
        color: COLORS.textSecondary,
    },
    link: {
        ...FONTS.body3,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;

