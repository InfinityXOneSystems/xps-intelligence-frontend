import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, X, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatPanelProps {
  onClose?: () => void
  commandMessage?: string | null
  onCommandProcessed?: () => void
}

export function AIChatPanel({ onClose, commandMessage, onCommandProcessed }: AIChatPanelProps) {
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

  useEffect(() => {
    if (commandMessage) {
      handleCommandMessage(commandMessage)
      onCommandProcessed?.()
    }
  }, [commandMessage])

  const handleCommandMessage = async (cmd: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: cmd,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const prompt = window.spark.llmPrompt`You are Lead Sniper, an AI assistant for the XPS Intelligence System. The user has executed a command from the command palette.

Command: ${cmd}

Process this command and provide a helpful response. If it's a scraper command, acknowledge it and explain what you would do. If it's about leads or data, provide relevant insights. If it's about code editing or functionality, explain the action. Be concise and actionable.`

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
        content: 'Sorry, I encountered an error processing that command. Please try again.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

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
      className="bg-surface h-full w-80 flex flex-col border-l border-border-subtle"
    >
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={20} className="text-gold" weight="fill" />
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

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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
                    'max-w-[85%] rounded-xl p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-[#1F2937] text-foreground'
                      : 'bg-[#111111] text-foreground border border-border'
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
              <div className="bg-[#111111] rounded-xl p-3 text-sm border border-border">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-2">
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
            className="flex-1 bg-card border-border focus:border-gold"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <PaperPlaneTilt size={16} weight="fill" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by GPT-4
        </p>
      </div>
    </motion.div>
  )
}
