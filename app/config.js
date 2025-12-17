import { Platform } from 'react-native';

// 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
// on the Android emulator.
// For iOS simulator, localhost works fine.
// For physical devices, you would need your machine's LAN IP.

const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5001/api'
    : 'http://localhost:5001/api';

export default API_URL;
