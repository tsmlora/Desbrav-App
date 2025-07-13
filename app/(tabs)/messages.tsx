import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MessageCircle, Send } from 'lucide-react-native';
import { useMessageStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';



export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { conversations, loading, loadConversations } = useMessageStore();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleConversationPress = (conversation: any) => {
    router.push(`/chat/${conversation.user.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversas..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationItem}
                onPress={() => handleConversationPress(conversation)}
              >
                <Image 
                  source={{ 
                    uri: conversation.user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                  }} 
                  style={styles.avatar} 
                />
                
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.userName}>{conversation.user.name}</Text>
                    <Text style={styles.timestamp}>
                      {conversation.lastMessage ? formatTimestamp(conversation.lastMessage.created_at) : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.messageRow}>
                    <Text 
                      style={[
                        styles.lastMessage,
                        conversation.unreadCount > 0 && styles.unreadMessage
                      ]} 
                      numberOfLines={1}
                    >
                      {conversation.lastMessage?.content || 'Sem mensagens'}
                    </Text>
                    
                    {conversation.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MessageCircle size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma mensagem ainda'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery 
                  ? 'Tente buscar por outro nome' 
                  : 'Comece uma conversa com outros motociclistas'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.newMessageButton}
        onPress={() => router.push('/search')}
      >
        <MessageCircle size={20} color={Colors.background} />
        <Text style={styles.newMessageText}>Nova Mensagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.cardDark,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  newMessageButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  newMessageText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});