import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface CommandBarProps {
  onCommand?: (command: string) => void
}

export function CommandBar({ onCommand }: CommandBarProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('command-input')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const cmd = command.trim().toLowerCase()
    setHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    if (cmd.startsWith('run scraper')) {
      const city = cmd.replace('run scraper', '').trim()
      toast.success(`Starting scraper${city ? ` for ${city}` : ''}...`)
      onCommand?.(`scraper:${city}`)
    } else if (cmd.startsWith('show top leads')) {
      toast.success('Displaying top leads')
      onCommand?.('leads:top')
    } else if (cmd.startsWith('generate outreach')) {
      toast.success('Generating outreach email...')
      onCommand?.('email:generate')
    } else if (cmd === 'help') {
      toast.info('Available commands: run scraper [city], show top leads, generate outreach')
    } else {
      toast.error('Unknown command. Type "help" for available commands.')
    }

    setCommand('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCommand(history[newIndex])
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card border-t border-border/50 p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Terminal size={20} className="text-primary" />
        <span className="text-primary font-mono">{'>'}</span>
        <Input
          id="command-input"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command... (Cmd/Ctrl+K to focus)"
          className="flex-1 font-mono text-sm bg-background/50 border-border/50 focus:border-primary"
        />
        <span className="text-xs text-muted-foreground">
          Press Enter
        </span>
      </form>
      <p className="text-xs text-muted-foreground mt-2 ml-11">
        Try: run scraper tampa, show top leads, generate outreach, help
      </p>
    </motion.div>
  )
}
