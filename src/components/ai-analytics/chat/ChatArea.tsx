import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "./types"
import { ChatMessage } from "./ChatMessage"

interface ChatAreaProps {
  messages: Message[]
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

export function ChatArea({ messages, input, isLoading, onInputChange, onSendMessage }: ChatAreaProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Ask questions about your leases, maintenance, payments, and more.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ScrollArea className="flex-1 pr-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </ScrollArea>
        <div className="flex mt-4">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={onSendMessage} 
            className="ml-2"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}