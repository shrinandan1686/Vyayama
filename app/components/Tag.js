import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const Tag = memo(({
    label,
    variant = 'primary', // primary, secondary, success, warning, info
    style
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: 'rgba(198, 255, 0, 0.1)',
                    color: COLORS.secondary,
                };
            case 'success':
                return {
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    color: COLORS.success,
                };
            case 'warning':
                return {
                    backgroundColor: 'rgba(255, 171, 64, 0.1)',
                    color: COLORS.warning,
                };
            case 'info':
                return {
                    backgroundColor: COLORS.glassDark,
                    color: COLORS.textSecondary,
                };
            case 'primary':
            default:
                return {
                    backgroundColor: 'rgba(46, 106, 255, 0.2)',
                    color: COLORS.primary,
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <View style={[styles.tag, { backgroundColor: variantStyles.backgroundColor }, style]}>
            <Text style={[styles.tagText, { color: variantStyles.color }]}>
                {label}
            </Text>
        </View>
    );
});

Tag.displayName = 'Tag';

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: SIZES.paddingMini,
        paddingVertical: 4,
        borderRadius: SIZES.marginSmall,
    },
    tagText: {
        fontSize: SIZES.small,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default Tag;
