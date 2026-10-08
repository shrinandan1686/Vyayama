import { Platform } from 'react-native';

// 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
// on the Android emulator - it does NOT work on a physical device.
// For iOS simulator, localhost works fine.
// For a physical Android device on the same Wi-Fi, use your machine's LAN IP
// (run `ipconfig getifaddr en0` on macOS) - update it here if your network changes.

// Physical devices (Expo Go) need the machine's LAN IP, not localhost.
// Override per-run with EXPO_PUBLIC_API_URL=http://<ip>:5001/api npx expo start
const API_URL = process.env.EXPO_PUBLIC_API_URL
    || (Platform.OS === 'web' ? 'http://localhost:5001/api' : 'http://192.168.31.158:5001/api');

export default API_URL;
