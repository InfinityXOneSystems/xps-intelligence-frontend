export type ToolCategory = 'browser' | 'crawler' | 'github' | 'system' | 'data' | 'deployment' | 'communication'

export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  enabled: boolean
  configurable: boolean
  config: Record<string, unknown>
}

const defaultTools: Tool[] = [
  {
    id: 'playwright_browser',
    name: 'Playwright Browser',
    description: 'Headless browser automation for scraping and interaction',
    category: 'browser',
    enabled: true,
    configurable: true,
    config: { headless: true, timeout: 30000 },
  },
  {
    id: 'http_crawler',
    name: 'HTTP Crawler',
    description: 'Fast HTTP-based crawler for structured data extraction',
    category: 'crawler',
    enabled: true,
    configurable: true,
    config: { maxConcurrency: 5, respectRobots: true, delayMs: 500 },
  },
  {
    id: 'github_api',
    name: 'GitHub API',
    description: 'Interact with GitHub repositories, issues, and Actions',
    category: 'github',
    enabled: true,
    configurable: true,
    config: { token: '', baseUrl: 'https://api.github.com' },
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Read and write files to the local filesystem',
    category: 'system',
    enabled: true,
    configurable: false,
    config: { rootPath: './workspace' },
  },
  {
    id: 'shell_exec',
    name: 'Shell Executor',
    description: 'Execute shell commands in a sandboxed environment',
    category: 'system',
    enabled: false,
    configurable: true,
    config: { shell: 'bash', timeout: 60000, allowedCommands: [] },
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Query and mutate application database records',
    category: 'data',
    enabled: true,
    configurable: true,
    config: { adapter: 'postgres', poolSize: 5 },
  },
  {
    id: 'deployment',
    name: 'Deployment',
    description: 'Deploy builds to cloud infrastructure providers',
    category: 'deployment',
    enabled: true,
    configurable: true,
    config: { provider: 'vercel', region: 'us-east-1' },
  },
  {
    id: 'scraper',
    name: 'Lead Scraper',
    description: 'Scrape business listings from Google Maps, Yelp, and directories',
    category: 'crawler',
    enabled: true,
    configurable: true,
    config: { sources: ['google_maps', 'yelp'], maxResults: 100 },
  },
  {
    id: 'email_generator',
    name: 'Email Generator',
    description: 'Generate personalized outreach emails using AI',
    category: 'communication',
    enabled: true,
    configurable: true,
    config: { tone: 'professional', maxLength: 300 },
  },
  {
    id: 'lead_scorer',
    name: 'Lead Scorer',
    description: 'Score and rank leads based on configurable signals',
    category: 'data',
    enabled: true,
    configurable: true,
    config: { algorithm: 'weighted', weights: { revenue: 0.4, recency: 0.3, engagement: 0.3 } },
  },
]

export class ToolRegistry {
  private tools: Map<string, Tool>

  constructor(initial: Tool[] = defaultTools) {
    this.tools = new Map(initial.map((t) => [t.id, { ...t }]))
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values())
  }

  getEnabled(): Tool[] {
    return this.getAll().filter((t) => t.enabled)
  }

  getById(id: string): Tool | undefined {
    return this.tools.get(id)
  }

  setEnabled(id: string, enabled: boolean): boolean {
    const tool = this.tools.get(id)
    if (!tool) return false
    this.tools.set(id, { ...tool, enabled })
    return true
  }

  updateConfig(id: string, config: Record<string, unknown>): boolean {
    const tool = this.tools.get(id)
    if (!tool || !tool.configurable) return false
    this.tools.set(id, { ...tool, config: { ...tool.config, ...config } })
    return true
  }

  toJSON(): Tool[] {
    return this.getAll()
  }
}

export const toolRegistry = new ToolRegistry()
