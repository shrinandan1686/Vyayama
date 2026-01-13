import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);
        // In production, you might want to log to an error reporting service
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>⚠️</Text>
                        <Text style={styles.title}>Oops! Something went wrong</Text>
                        <Text style={styles.message}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.handleReset}
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    emoji: {
        fontSize: 64,
        marginBottom: SIZES.marginSection,
    },
    title: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: SIZES.marginSmall,
        textAlign: 'center',
    },
    message: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SIZES.marginSection,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.paddingSmall,
        borderRadius: SIZES.radius,
        minWidth: 120,
    },
    buttonText: {
        ...FONTS.button,
        color: COLORS.white,
        textAlign: 'center',
    },
});

export default ErrorBoundary;
