import { create } from 'zustand'
import { supabase, Message } from '@/lib/supabase'
import { useAuthStore } from './authStore'

interface Conversation {
  id: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
  lastMessage?: Message
  unreadCount: number
}

interface MessageState {
  conversations: Conversation[]
  messages: { [conversationId: string]: Message[] }
  loading: boolean
  loadConversations: () => Promise<void>
  loadMessages: (userId: string) => Promise<void>
  sendMessage: (receiverId: string, content: string) => Promise<boolean>
  markAsRead: (conversationId: string) => Promise<void>
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: {},
  loading: false,

  loadConversations: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      // First, get all messages for the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (messagesError) throw messagesError

      // Get unique user IDs from messages
      const userIds = new Set<string>()
      messagesData?.forEach((message: any) => {
        if (message.sender_id !== user.id) userIds.add(message.sender_id)
        if (message.receiver_id !== user.id) userIds.add(message.receiver_id)
      })

      // Get user details for all conversation partners
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', Array.from(userIds))

      if (usersError) throw usersError

      // Create a map of users for quick lookup
      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>()

      messagesData?.forEach((message: any) => {
        const isFromCurrentUser = message.sender_id === user.id
        const conversationPartnerId = isFromCurrentUser ? message.receiver_id : message.sender_id
        const conversationPartner = usersMap.get(conversationPartnerId)

        if (!conversationPartner) return

        if (!conversationMap.has(conversationPartnerId)) {
          conversationMap.set(conversationPartnerId, {
            id: conversationPartnerId,
            user: conversationPartner,
            lastMessage: message,
            unreadCount: 0,
          })
        }

        // Update unread count
        if (!isFromCurrentUser && !message.read) {
          const conversation = conversationMap.get(conversationPartnerId)!
          conversation.unreadCount++
        }
      })

      set({ conversations: Array.from(conversationMap.values()) })
    } catch (error) {
      console.error('Error loading conversations:', JSON.stringify(error, null, 2))
    } finally {
      set({ loading: false })
    }
  },

  loadMessages: async (userId: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error

      set(state => ({
        messages: {
          ...state.messages,
          [userId]: data || []
        }
      }))
    } catch (error) {
      console.error('Error loading messages:', JSON.stringify(error, null, 2))
    } finally {
      set({ loading: false })
    }
  },

  sendMessage: async (receiverId: string, content: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: receiverId,
            content,
            read: false,
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Add message to local state
      set(state => ({
        messages: {
          ...state.messages,
          [receiverId]: [...(state.messages[receiverId] || []), data]
        }
      }))

      // Refresh conversations
      get().loadConversations()

      return true
    } catch (error) {
      console.error('Error sending message:', JSON.stringify(error, null, 2))
      return false
    }
  },

  markAsRead: async (conversationId: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('read', false)

      // Update local state
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      }))
    } catch (error) {
      console.error('Error marking messages as read:', JSON.stringify(error, null, 2))
    }
  },
}))