import { Message } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
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
  )
}