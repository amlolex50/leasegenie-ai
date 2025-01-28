import { Message } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}>
      <div className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"} gap-2`}>
        <Avatar className="w-8 h-8 mt-0.5">
          <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
          <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
        </Avatar>
        <div
          className={`px-4 py-2 rounded-lg ${
            message.role === "user" 
              ? "bg-primary text-primary-foreground rounded-br-none" 
              : "bg-muted rounded-bl-none"
          } break-words`}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}