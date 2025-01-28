export type Message = {
  role: "user" | "assistant"
  content: string
}

export type Chat = {
  id: string
  messages: Message[]
  created_at: string
}