import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, PlusCircle } from "lucide-react"
import { Chat } from "./types"

interface ChatListProps {
  chats: Chat[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
}

export function ChatList({ chats, currentChatId, onNewChat, onSelectChat }: ChatListProps) {
  return (
    <Card className="w-64 flex flex-col">
      <CardHeader>
        <CardTitle>Chats</CardTitle>
        <Button 
          onClick={onNewChat}
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
              onClick={() => onSelectChat(chat.id)}
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
  )
}