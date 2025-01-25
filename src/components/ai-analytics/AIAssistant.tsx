import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your LeaseGenie AI assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = { role: "assistant", content: simulateAIResponse(input) }
      setMessages((prevMessages) => [...prevMessages, aiResponse])
    }, 1000)
  }

  const simulateAIResponse = (userInput: string): string => {
    const responses = {
      lease: "Your lease agreement is valid until December 31, 2023. The next rent payment is due on June 1, 2023.",
      maintenance: "You have 2 open maintenance tickets: 1) HVAC repair in Unit 101, and 2) Leaky faucet in Unit 205.",
      payment: "Your last rent payment of $2,500 was received on May 1, 2023. The next payment is due on June 1, 2023.",
      default:
        "I'm sorry, I don't have specific information about that. Could you please provide more details or ask another question?",
    }

    const lowercaseInput = userInput.toLowerCase()
    if (lowercaseInput.includes("lease")) return responses.lease
    if (lowercaseInput.includes("maintenance")) return responses.maintenance
    if (lowercaseInput.includes("payment")) return responses.payment
    return responses.default
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Ask questions about your leases, maintenance, payments, and more.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
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
          />
          <Button onClick={handleSendMessage} className="ml-2">
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}