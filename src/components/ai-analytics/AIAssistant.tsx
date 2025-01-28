import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, MessageSquare } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Chat = {
  id: string
  messages: Message[]
  created_at: string
}

export function AIAssistant() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch user's chat history
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedChats = data.map(chat => ({
          id: chat.id,
          messages: chat.messages as Message[],
          created_at: chat.created_at
        }))

        setChats(formattedChats)
        
        // Set the most recent chat as current if none selected
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

    fetchChats()
  }, [currentChatId, toast])

  const createNewChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const initialMessage = { role: "assistant", content: "Hello! I'm your ManageLeaseAI assistant. How can I help you today?" }
      
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          messages: [initialMessage]
        })
        .select()
        .single()

      if (error) throw error

      const newChat = {
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

      // Get AI response
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

      // Update chat history in database
      const { error: updateError } = await supabase
        .from('chat_history')
        .update({ messages: finalMessages })
        .eq('id', currentChatId)

      if (updateError) throw updateError

      // Update local chat history
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

  return (
    <div className="flex h-[800px] gap-4">
      {/* Chat List Sidebar */}
      <Card className="w-64 flex flex-col">
        <CardHeader>
          <CardTitle>Chats</CardTitle>
          <Button 
            onClick={createNewChat}
            className="w-full"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full px-3">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant={chat.id === currentChatId ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => switchChat(chat.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {chat.messages[0].content.substring(0, 20)}...
                </span>
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Ask questions about your leases, maintenance, payments, and more.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                    <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              className="ml-2"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}