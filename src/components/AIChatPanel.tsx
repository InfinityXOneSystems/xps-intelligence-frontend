import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, X, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { llmRouter } from '@/lib/llm'
import { agentPlanner } from '@/lib/agentPlanner'

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

const AGENT_COMMANDS = [
  'scrape epoxy companies Orlando',
  'generate outreach email',
  'build analytics dashboard',
  'deploy backend',
  'analyze leads',
]

const isAgentCommand = (text: string): boolean => {
  const lower = text.toLowerCase()
  return (
    lower.startsWith('scrape ') ||
    lower.startsWith('deploy ') ||
    lower.startsWith('build ') ||
    lower.includes('generate') ||
    lower.includes('analyze leads') ||
    lower.includes('run scraper') ||
    lower.includes('github action')
  )
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isAgentResponse?: boolean
}

interface AIChatPanelProps {
  onClose?: () => void
}

export function AIChatPanel({ onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Lead Sniper, your autonomous AI platform assistant. I can answer questions OR run agent commands.\n\nTry:\n• "scrape epoxy companies Orlando"\n• "generate outreach email"\n• "build analytics dashboard"\n• "deploy backend"',
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
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      let responseContent: string
      let isAgentResponse = false

      if (isAgentCommand(currentInput)) {
        isAgentResponse = true
        const plan = await agentPlanner.createPlan(currentInput)
        responseContent = `🤖 Agent plan created: **${plan.tasks.length} tasks** dispatched.\n\n`
        responseContent += plan.tasks.map((t, i) => `${i + 1}. [${t.type}] ${t.description}`).join('\n')
        responseContent += '\n\n➡️ Go to **Agent** page to monitor execution in real-time.'

        agentPlanner.executePlan(plan, () => {})
      } else {
        const promptText = `You are Lead Sniper, an AI assistant for contractor sales and lead generation. 
      
User query: ${currentInput}

Provide a helpful, concise response. If they ask to find leads, suggest searching the leads database. If they ask to generate an email, provide a professional contractor outreach email template. Keep responses under 3 paragraphs.`
        responseContent = await llmRouter.complete(promptText)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        isAgentResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
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
          <Badge variant="outline" className="text-xs">AI Agent</Badge>
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
                    message.isAgentResponse && 'border border-primary/30 rounded-lg p-3 bg-primary/5'
                  )}
                >
                  {message.isAgentResponse && (
                    <div className="flex items-center gap-1 mb-1 text-primary text-xs font-semibold">
                      <Lightning size={12} weight="fill" />
                      Agent Plan
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
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

      <div className="px-3 py-2 border-t border-border-subtle/50">
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {AGENT_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => setInput(cmd)}
              className="whitespace-nowrap text-xs px-2 py-1 rounded-full border border-border-subtle text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex-shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask or run a command..."
              className="w-full text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-offset-0 px-4 py-3 rounded-xl border-2 border-transparent"
              style={{
                background: 'rgba(0, 0, 0, 0.70)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              disabled={isLoading}
            />
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                padding: '2px',
                background: 'linear-gradient(135deg, var(--gradient-gold-start) 0%, var(--gradient-gold-mid) 25%, var(--gradient-silver-start) 50%, var(--gradient-gold-mid) 75%, var(--gradient-gold-start) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s linear infinite',
              }}
            />
          </div>
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
          Agent-powered · Groq / Gemini / HuggingFace
        </p>
      </div>
    </motion.div>
  )
}
