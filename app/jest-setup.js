jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Platform.OS = 'ios';
    RN.Platform.select = jest.fn(objs => objs.ios || objs.default);
    return RN;
});

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mocking some other common native modules that might cause "out of scope" errors
jest.mock('expo-linear-gradient', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        LinearGradient: ({ children, ...props }) => React.createElement(View, props, children)
    };
});

// Fix for Expo router/internal globals
global.__ExpoImportMetaRegistry = {};
if (typeof global.structuredClone === 'undefined') {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
