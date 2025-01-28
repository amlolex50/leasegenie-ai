import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Chat, Message } from "./types"

export function useChatState() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchChats()
  }, [currentChatId])

  const fetchChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedChats: Chat[] = data.map(chat => ({
        id: chat.id,
        messages: chat.messages as Message[],
        created_at: chat.created_at
      }))

      setChats(formattedChats)
      
      if (!currentChatId && formattedChats.length > 0) {
        setCurrentChatId(formattedChats[0].id)
        setMessages(formattedChats[0].messages)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      })
    }
  }

  const createNewChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const initialMessage: Message = { 
        role: "assistant", 
        content: "Hello! I'm your ManageLeaseAI assistant. How can I help you today?" 
      }
      
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          messages: [initialMessage]
        })
        .select()
        .single()

      if (error) throw error

      const newChat: Chat = {
        id: data.id,
        messages: [initialMessage],
        created_at: data.created_at
      }

      setChats(prev => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      setMessages([initialMessage])
      setInput("")
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading || !currentChatId) return

    const userMessage: Message = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: input, userId: user.id }
      })

      if (error) throw error

      const aiResponse: Message = { 
        role: "assistant", 
        content: data.response || "I apologize, but I'm having trouble processing your request right now."
      }
      
      const finalMessages = [...updatedMessages, aiResponse]
      setMessages(finalMessages)

      const { error: updateError } = await supabase
        .from('chat_history')
        .update({ messages: finalMessages })
        .eq('id', currentChatId)

      if (updateError) throw updateError

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        )
      )
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const switchChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
      setInput("")
    }
  }

  return {
    chats,
    currentChatId,
    messages,
    input,
    isLoading,
    setInput,
    createNewChat,
    handleSendMessage,
    switchChat,
  }
}