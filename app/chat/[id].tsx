import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useMessageStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/colors';



export default function ChatScreen() {
  const { id: userId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { user } = useAuthStore();
  const { messages, loadMessages, sendMessage, markAsRead } = useMessageStore();
  
  const chatMessages = messages[userId || ''] || [];

  useEffect(() => {
    if (userId && user) {
      loadUserData();
      loadMessages(userId);
      markAsRead(userId);
    }
  }, [userId, user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setOtherUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !userId) return;

    const success = await sendMessage(userId, message.trim());
    if (success) {
      setMessage('');
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Image 
          source={{ 
            uri: otherUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }} 
          style={styles.headerAvatar} 
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUser?.name}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {chatMessages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <View
              key={msg.id}
              style={[
                styles.messageItem,
                isMe ? styles.myMessage : styles.otherMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.otherMessageText
              ]}>
                {msg.content}
              </Text>
              <Text style={[
                styles.messageTime,
                isMe ? styles.myMessageTime : styles.otherMessageTime
              ]}>
                {formatMessageTime(msg.created_at)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={Colors.textSecondary}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: Colors.primary,
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageItem: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.background,
  },
  otherMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});