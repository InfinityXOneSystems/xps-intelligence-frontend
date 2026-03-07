import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const CrosshairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#800000" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
    <line x1="12" y1="1" x2="12" y2="7" stroke="#800000" strokeWidth="2" />
    <line x1="12" y1="17" x2="12" y2="23" stroke="#800000" strokeWidth="2" />
    <line x1="1" y1="12" x2="7" y2="12" stroke="#800000" strokeWidth="2" />
    <line x1="17" y1="12" x2="23" y2="12" stroke="#800000" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
  </svg>
)

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatPanelProps {
  onClose?: () => void
}

export function AIChatPanel({ onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Lead Sniper, your AI sales assistant. I can help you find leads, generate outreach emails, answer contractor sales questions, and execute any command you need. Try asking me something!',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const prompt = window.spark.llmPrompt`You are Lead Sniper, an AI assistant for contractor sales and lead generation. 
      
User query: ${input}

Provide a helpful, concise response. If they ask to find leads, suggest searching the leads database. If they ask to generate an email, provide a professional contractor outreach email template. Keep responses under 3 paragraphs.`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="h-full w-80 flex flex-col border-l border-border-subtle"
      style={{
        background: 'var(--card)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      }}
    >
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrosshairIcon />
          <h2 className="font-bold text-foreground">Lead Sniper</h2>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] text-sm',
                    message.role === 'user'
                      ? 'text-foreground'
                      : 'text-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask Lead Sniper..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-offset-0 px-4 py-3 rounded-xl"
            style={{
              border: '1px solid oklch(0.42 0.14 20)',
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12 L19 5 L12 19 L10 14 L5 12 Z" fill="oklch(0.42 0.14 20)" stroke="oklch(0.42 0.14 20)" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by GPT-4
        </p>
      </div>
    </motion.div>
  )
}
