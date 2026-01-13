import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
    Image,
    Keyboard,
    Animated,
    StatusBar,
    Modal,
    Pressable,
    ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import * as ImagePicker from 'expo-image-picker';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const { userToken } = useContext(AuthContext);
    const flatListRef = useRef();
    const bottomTabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async (sessionId = null) => {
        setIsLoadingHistory(true);
        try {
            const targetSession = sessionId || activeSessionId || 'default';
            const response = await axios.get(`${API_URL}/chat/history`, {
                params: { sessionId: targetSession },
                headers: { 'x-auth-token': userToken }
            });
            if (response.data.history && response.data.history.length > 0) {
                // Ensure messages are unique by ID
                const uniqueHistory = [];
                const seenIds = new Set();

                response.data.history.forEach(msg => {
                    if (!seenIds.has(msg.id)) {
                        uniqueHistory.push(msg);
                        seenIds.add(msg.id);
                    }
                });
                setMessages(uniqueHistory);
            } else {
                setMessages([
                    { id: '1', text: "Hello! I'm your Vyayama AI Coach. How can I help you reach your fitness goals today?", sender: 'ai' }
                ]);
            }
        } catch (error) {
            console.log('History Fetch Error:', error);
            setMessages([
                { id: '1', text: "Hello! I'm your AI Fitness Coach. Ask me anything about your workout or health.", sender: 'ai' }
            ]);
        } finally {
            setIsLoadingHistory(false);
            // Wait for list to render before scrolling
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 500);
        }
    };
    async function fetchSessions() {
        try {
            const response = await axios.get(`${API_URL}/chat/sessions`, {
                headers: { 'x-auth-token': userToken }
            });
            setSessions(response.data.sessions || []);
        } catch (error) {
            console.log('Fetch Sessions Error:', error);
        }
    }

    const loadSession = (sessionId) => {
        setActiveSessionId(sessionId);
        setMessages([]); // Clear current while loading
        fetchChatHistory(sessionId);
        setShowHistoryModal(false);
    };

    const resetChat = async () => {
        try {
            setIsLoadingHistory(true);
            if (activeSessionId) {
                await axios.delete(`${API_URL}/chat/session`, {
                    params: { sessionId: activeSessionId },
                    headers: { 'x-auth-token': userToken }
                });
            }
            setActiveSessionId(null);
            setMessages([
                { id: `wel_${Date.now()}`, text: "Hello! I'm your Vyayama AI Coach. How can I help you reach your fitness goals today?", sender: 'ai' }
            ]);
        } catch (error) {
            console.log('Reset Session Error:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() && !selectedImage) return;

        let sessionId = activeSessionId;
        const isFirstMessage = !sessionId;

        if (!sessionId) {
            sessionId = `chat_${Date.now()}`;
        }

        const userMsg = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: inputText,
            sender: 'user',
            image: selectedImage?.uri
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        const imageToUpload = selectedImage?.base64;
        setSelectedImage(null);
        setIsTyping(true);

        Keyboard.dismiss();
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message: userMsg.text,
                imageBase64: imageToUpload,
                sessionId: sessionId
            }, {
                headers: { 'x-auth-token': userToken }
            });

            if (isFirstMessage) {
                setActiveSessionId(sessionId);
            }

            const aiMsg = {
                id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: response.data.response || "I couldn't get a response at this time.",
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.log('Chat Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: `err_${Date.now()}`,
                text: "Sorry, I'm having trouble connecting to my brain right now. Please try again.",
                sender: 'ai'
            }]);
        } finally {
            setIsTyping(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageContainer,
                isUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }
            ]}>
                <View style={[
                    styles.messageWrapper,
                    isUser ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
                ]}>
                    {!isUser && (
                        <View style={styles.aiAvatar}>
                            <MaterialCommunityIcons name="robot" size={18} color={COLORS.primary} />
                        </View>
                    )}

                    <View style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.aiBubble
                    ]}>
                        {isUser ? (
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryGradientEnd]}
                                style={styles.gradientBubble}
                            >
                                {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
                                <Text style={styles.userText}>{item.text}</Text>
                            </LinearGradient>
                        ) : (
                            <Markdown style={markdownStyles}>
                                {item.text}
                            </Markdown>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoadingHistory) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 20, color: COLORS.textSecondary }}>Refreshing Coach Memory...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconButton} onPress={resetChat}>
                    <Ionicons name="add" size={28} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Vyayama AI</Text>
                    <View style={styles.headerBadge}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.headerIconButton}
                    onPress={() => {
                        fetchSessions();
                        setShowHistoryModal(true);
                    }}
                >
                    <Ionicons name="time-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={15}
            />

            {isTyping && (
                <View style={styles.typingIndicator}>
                    <View style={styles.aiAvatarSmall}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                    <Text style={styles.typingText}>Vyayama is thinking...</Text>
                </View>
            )}

            {/* History Modal */}
            <Modal
                visible={showHistoryModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowHistoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chat History</Text>
                            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.sessionList}>
                            {sessions.length === 0 ? (
                                <Text style={styles.emptyText}>No previous chats found.</Text>
                            ) : (
                                sessions.map((session) => (
                                    <TouchableOpacity
                                        key={session.session_id}
                                        style={[
                                            styles.sessionItem,
                                            activeSessionId === session.session_id && styles.activeSessionItem
                                        ]}
                                        onPress={() => loadSession(session.session_id)}
                                    >
                                        <View style={styles.sessionIcon}>
                                            <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.sessionInfo}>
                                            <Text style={styles.sessionTitle} numberOfLines={1}>
                                                {session.title || "New Conversation"}
                                            </Text>
                                            <Text style={styles.sessionDate}>
                                                {session.updated_at ? new Date(session.updated_at).toLocaleDateString() : 'Just now'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.newChatModalButton}
                            onPress={() => {
                                resetChat();
                                setShowHistoryModal(false);
                            }}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryGradientEnd]}
                                style={styles.modalButtonGradient}
                            >
                                <Ionicons name="add" size={22} color={COLORS.white} />
                                <Text style={styles.newChatModalText}>Start New Chat</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{ width: '100%' }}
            >
                {selectedImage && (
                    <View style={styles.imagePreviewContainer}>
                        <View style={styles.imagePreviewWrapper}>
                            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Ionicons name="close-circle" size={20} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <BlurView
                    intensity={90}
                    tint="dark"
                    style={[
                        styles.inputWrapper,
                        { paddingBottom: Platform.OS === 'ios' ? bottomTabBarHeight : bottomTabBarHeight + 10 }
                    ]}
                >
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                            <Ionicons name="attach" size={26} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Message Vyayama AI..."
                            placeholderTextColor={COLORS.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxHeight={120}
                        />

                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() && !selectedImage) && { opacity: 0.5, backgroundColor: COLORS.surfaceLight }
                            ]}
                            onPress={sendMessage}
                            disabled={!inputText.trim() && !selectedImage}
                        >
                            <Ionicons name="arrow-up" size={22} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const markdownStyles = StyleSheet.create({
    body: {
        color: COLORS.text,
        fontSize: 15,
        lineHeight: 22,
    },
    bullet_list: {
        marginVertical: 5,
    },
    list_item: {
        marginVertical: 2,
    },
    strong: {
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    code_inline: {
        backgroundColor: COLORS.borderLight,
        paddingHorizontal: 4,
        borderRadius: 4,
        color: COLORS.secondary,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.paddingSmall,
        paddingTop: Platform.OS === 'android' ? SIZES.marginSmall : 0,
        paddingBottom: SIZES.paddingSmall,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderFocus,
    },
    headerInfo: {
        alignItems: 'center',
    },
    headerTitle: {
        ...FONTS.h3,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginRight: 5,
    },
    onlineText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small + 1,
        fontWeight: '600',
    },
    headerIconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 30,
        paddingTop: 20
    },
    messageContainer: {
        marginVertical: 12,
        width: '100%',
    },
    messageWrapper: {
        maxWidth: '85%',
        alignItems: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(46, 106, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.marginSmall,
        marginTop: 2,
        borderWidth: 1,
        borderColor: 'rgba(46, 106, 255, 0.2)',
    },
    messageBubble: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    userBubble: {
        borderBottomRightRadius: 4,
        alignSelf: 'flex-end',
    },
    aiBubble: {
        backgroundColor: COLORS.cardBackground,
        borderBottomLeftRadius: 4,
        paddingHorizontal: SIZES.paddingSmall,
        paddingVertical: 14,
        flex: 1,
    },
    gradientBubble: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    userText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 22,
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginBottom: 10,
    },
    inputWrapper: {
        borderTopWidth: 1,
        borderTopColor: COLORS.borderFocus,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: SIZES.paddingMini,
        paddingVertical: SIZES.paddingSmall,
    },
    attachButton: {
        padding: SIZES.marginSmall,
        marginBottom: 2,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: SIZES.marginSmall,
        color: COLORS.white,
        fontSize: 15,
        marginHorizontal: SIZES.marginSmall,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    aiAvatarSmall: {
        width: 24,
        height: 24,
        borderRadius: SIZES.radius,
        backgroundColor: 'rgba(46, 106, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.marginSmall,
    },
    typingText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.caption + 1,
        fontWeight: '500',
    },
    imagePreviewContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    imagePreviewWrapper: {
        width: 60,
        height: 60,
    },
    imagePreview: {
        width: 60,
        height: 60,
        borderRadius: SIZES.marginSmall,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    removeImageButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: COLORS.background,
        borderRadius: SIZES.marginSmall,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.modalBackground,
        borderTopLeftRadius: SIZES.marginSection,
        borderTopRightRadius: SIZES.marginSection,
        height: '75%',
        padding: SIZES.padding,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.marginSection,
    },
    modalTitle: {
        ...FONTS.h2,
        fontWeight: '700',
    },
    sessionList: {
        flex: 1,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.paddingSmall,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radiusLarge,
        marginBottom: SIZES.marginVertical,
    },
    activeSessionItem: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        backgroundColor: 'rgba(46, 106, 255, 0.1)',
    },
    sessionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.borderDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.paddingSmall,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionTitle: {
        ...FONTS.body3,
        fontWeight: '600',
    },
    sessionDate: {
        color: COLORS.textSecondary,
        fontSize: SIZES.caption,
        marginTop: 4,
    },
    emptyText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 60,
        ...FONTS.body3,
    },
    newChatModalButton: {
        marginTop: 20,
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
    },
    modalButtonGradient: {
        flexDirection: 'row',
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newChatModalText: {
        ...FONTS.body3,
        fontWeight: '700',
        marginLeft: SIZES.marginSmall,
    }
});

export default ChatScreen;
