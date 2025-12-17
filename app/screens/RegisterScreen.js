import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ScreenWrapper from '../components/ScreenWrapper';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { COLORS, FONTS } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        await register(name, email, password);
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and start your transformation</Text>
                    </View>

                    <View style={styles.form}>
                        <AppInput
                            label="Full Name"
                            value={name}
                            placeholder="John Doe"
                            onChangeText={text => setName(text)}
                        />
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
                            placeholder="Choose a strong password"
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />

                        <View style={{ height: 20 }} />

                        <AppButton
                            title="REGISTER"
                            onPress={handleRegister}
                            loading={loading}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.link}>Login</Text>
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
        marginTop: 20,
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
        marginBottom: 20,
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

export default RegisterScreen;

