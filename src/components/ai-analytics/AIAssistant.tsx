import { ChatList } from "./chat/ChatList"
import { ChatArea } from "./chat/ChatArea"
import { useChatState } from "./chat/useChatState"

export function AIAssistant() {
  const {
    chats,
    currentChatId,
    messages,
    input,
    isLoading,
    setInput,
    createNewChat,
    handleSendMessage,
    switchChat,
  } = useChatState()

  return (
    <div className="flex h-[800px] gap-4">
      <ChatList
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onSelectChat={switchChat}
      />
      <ChatArea
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}