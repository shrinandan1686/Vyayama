import { Platform } from 'react-native';

// 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
// on the Android emulator - it does NOT work on a physical device.
// For iOS simulator, localhost works fine.
// For a physical Android device on the same Wi-Fi, use your machine's LAN IP
// (run `ipconfig getifaddr en0` on macOS) - update it here if your network changes.

const API_URL = Platform.OS === 'android'
    ? 'http://192.168.1.5:5001/api'
    : 'http://localhost:5001/api';

export default API_URL;
