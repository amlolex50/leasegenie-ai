import { Message } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"

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
          } prose prose-sm max-w-none break-words`}
        >
          {message.role === "user" ? (
            message.content
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-muted-foreground/20 rounded px-1 py-0.5">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted-foreground/20 rounded p-2 my-2 overflow-x-auto">
                    {children}
                  </pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}