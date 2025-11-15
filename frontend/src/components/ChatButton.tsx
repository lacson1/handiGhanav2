import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { chatApi } from '../lib/api'
import ChatWindow from './ChatWindow'
import Button from './ui/Button'

interface ChatButtonProps {
  providerId: string
  providerName: string
  bookingId?: string
  variant?: 'button' | 'icon'
}

export default function ChatButton({
  providerId,
  providerName,
  bookingId,
  variant = 'button'
}: ChatButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleOpenChat = async () => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to start a chat')
      return
    }

    setLoading(true)
    try {
      const response = await chatApi.getOrCreateChat(providerId, bookingId)
      setChatId(response.chat.id)
      setIsChatOpen(true)
    } catch (error) {
      console.error('Failed to open chat:', error)
      alert('Failed to open chat. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleOpenChat}
          disabled={loading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Start chat"
        >
          <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        {isChatOpen && chatId && (
          <ChatWindow
            chatId={chatId}
            providerId={providerId}
            providerName={providerName}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Button
        onClick={handleOpenChat}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {loading ? 'Opening...' : 'Chat'}
      </Button>
      {isChatOpen && chatId && (
        <ChatWindow
          chatId={chatId}
          providerId={providerId}
          providerName={providerName}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  )
}

