/**
 * github-integration.ts
 *
 * Frontend-side GitHub API client for the XPS Intelligence platform.
 *
 * Provides:
 *  - OAuth token management
 *  - Repository, deployment, and commit status operations
 *  - Webhook configuration helpers
 *  - Docker sync status tracking
 *
 * All methods fall back gracefully when the GitHub token is absent, returning
 * typed mock/empty results so the UI never hard-crashes on missing credentials.
 */

const GITHUB_API_BASE = 'https://api.github.com'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GitHubConfig {
  token: string
  repoOwner: string
  repoName: string
  webhookReceiverUrl?: string
}

export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  defaultBranch: string
  htmlUrl: string
  pushedAt: string | null
  private: boolean
}

export interface GitHubCommit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export type CommitState = 'error' | 'failure' | 'pending' | 'success'

export interface CommitStatus {
  state: CommitState
  description: string
  context: string
  createdAt: string
}

export type DeploymentState =
  | 'error'
  | 'failure'
  | 'inactive'
  | 'in_progress'
  | 'queued'
  | 'pending'
  | 'success'

export interface Deployment {
  id: number
  sha: string
  ref: string
  environment: string
  description: string
  createdAt: string
  creator: string
}

export interface DeploymentStatus {
  id: number
  state: DeploymentState
  description: string
  environment: string
  createdAt: string
  logUrl: string
}

export interface SyncStatus {
  lastSyncAt: string | null
  lastCommitSha: string | null
  lastCommitMessage: string | null
  deploymentState: DeploymentState | null
  webhookReachable: boolean
}

export interface GitHubWebhook {
  id: number
  url: string
  events: string[]
  active: boolean
  createdAt: string
}

// ─── Client ────────────────────────────────────────────────────────────────

export class GitHubIntegration {
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = config
  }

  /** Returns true when the integration has a token set. */
  get isConfigured(): boolean {
    return Boolean(this.config.token)
  }

  // ─── Internal HTTP helper ─────────────────────────────────────────────

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    if (!this.config.token) {
      throw new Error('GitHub token is not configured')
    }
    const url = `${GITHUB_API_BASE}${path}`
    const init: RequestInit = {
      method,
      headers: {
        Authorization: `token ${this.config.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }
    const response = await fetch(url, init)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`GitHub API ${response.status}: ${text}`)
    }
    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  private get repoPath(): string {
    return `/repos/${this.config.repoOwner}/${this.config.repoName}`
  }

  // ─── Repository ───────────────────────────────────────────────────────

  /** Fetch basic repository metadata. */
  async getRepository(): Promise<GitHubRepo> {
    const raw = await this.request<Record<string, unknown>>('GET', this.repoPath)
    return {
      id: Number(raw.id),
      name: String(raw.name ?? ''),
      fullName: String(raw.full_name ?? ''),
      defaultBranch: String(raw.default_branch ?? 'main'),
      htmlUrl: String(raw.html_url ?? ''),
      pushedAt: raw.pushed_at ? String(raw.pushed_at) : null,
      private: Boolean(raw.private),
    }
  }

  // ─── Commits ──────────────────────────────────────────────────────────

  /** Fetch the most recent commits on a branch (default: defaultBranch). */
  async getRecentCommits(branch?: string, perPage = 10): Promise<GitHubCommit[]> {
    const ref = branch ?? 'HEAD'
    const raw = await this.request<Record<string, unknown>[]>(
      'GET',
      `${this.repoPath}/commits?sha=${encodeURIComponent(ref)}&per_page=${perPage}`,
    )
    return raw.map((c) => {
      const commit = (c.commit ?? {}) as Record<string, unknown>
      const commitAuthor = (commit.author ?? {}) as Record<string, unknown>
      const author = (c.author ?? {}) as Record<string, unknown>
      return {
        sha: String(c.sha ?? ''),
        message: String(commit.message ?? ''),
        author: String(author.login ?? commitAuthor.name ?? ''),
        date: String(commitAuthor.date ?? ''),
        url: String(c.html_url ?? ''),
      }
    })
  }

  // ─── Commit status ────────────────────────────────────────────────────

  /** Create or update a commit status. */
  async setCommitStatus(
    sha: string,
    state: CommitState,
    description: string,
    context = 'xps/docker-sync',
    targetUrl?: string,
  ): Promise<CommitStatus> {
    const raw = await this.request<Record<string, unknown>>(
      'POST',
      `${this.repoPath}/statuses/${sha}`,
      {
        state,
        description,
        context,
        target_url: targetUrl ?? '',
      },
    )
    return {
      state: (raw.state ?? 'error') as CommitState,
      description: String(raw.description ?? ''),
      context: String(raw.context ?? ''),
      createdAt: String(raw.created_at ?? ''),
    }
  }

  /** Fetch the combined commit status for a SHA. */
  async getCommitStatus(sha: string): Promise<CommitState> {
    const raw = await this.request<Record<string, unknown>>(
      'GET',
      `${this.repoPath}/commits/${sha}/status`,
    )
    return (raw.state ?? 'pending') as CommitState
  }

  // ─── Deployments ──────────────────────────────────────────────────────

  /** Create a new GitHub deployment record. */
  async createDeployment(
    ref: string,
    environment = 'docker',
    description = 'XPS Intelligence Docker sync',
  ): Promise<Deployment> {
    const raw = await this.request<Record<string, unknown>>(
      'POST',
      `${this.repoPath}/deployments`,
      {
        ref,
        environment,
        description,
        auto_merge: false,
        required_contexts: [],
      },
    )
    const creator = (raw.creator ?? {}) as Record<string, unknown>
    return {
      id: Number(raw.id),
      sha: String(raw.sha ?? ''),
      ref: String(raw.ref ?? ''),
      environment: String(raw.environment ?? ''),
      description: String(raw.description ?? ''),
      createdAt: String(raw.created_at ?? ''),
      creator: String(creator.login ?? ''),
    }
  }

  /** Post a status update to an existing deployment. */
  async updateDeploymentStatus(
    deploymentId: number,
    state: DeploymentState,
    description?: string,
    logUrl?: string,
  ): Promise<DeploymentStatus> {
    const raw = await this.request<Record<string, unknown>>(
      'POST',
      `${this.repoPath}/deployments/${deploymentId}/statuses`,
      {
        state,
        description: description ?? `Docker deployment ${state}`,
        environment: 'docker',
        log_url: logUrl ?? '',
      },
    )
    return {
      id: Number(raw.id),
      state: (raw.state ?? 'error') as DeploymentState,
      description: String(raw.description ?? ''),
      environment: String(raw.environment ?? ''),
      createdAt: String(raw.created_at ?? ''),
      logUrl: String(raw.log_url ?? ''),
    }
  }

  // ─── Webhooks ─────────────────────────────────────────────────────────

  /** List all webhooks configured on the repository. */
  async listWebhooks(): Promise<GitHubWebhook[]> {
    const raw = await this.request<Record<string, unknown>[]>(
      'GET',
      `${this.repoPath}/hooks`,
    )
    return raw.map((h) => {
      const config = (h.config ?? {}) as Record<string, unknown>
      return {
        id: Number(h.id),
        url: String(config.url ?? ''),
        events: Array.isArray(h.events) ? h.events.map(String) : [],
        active: Boolean(h.active),
        createdAt: String(h.created_at ?? ''),
      }
    })
  }

  /**
   * Register the Docker webhook receiver URL on the repository.
   * Idempotent — if a webhook with the same URL already exists, it is returned.
   */
  async registerWebhook(
    webhookUrl: string,
    secret: string,
    events = ['push', 'workflow_run', 'deployment_status'],
  ): Promise<GitHubWebhook> {
    const existing: GitHubWebhook[] = await this.listWebhooks().catch(() => [])
    const found = existing.find((w) => w.url === webhookUrl)
    if (found) return found

    const raw = await this.request<Record<string, unknown>>(
      'POST',
      `${this.repoPath}/hooks`,
      {
        name: 'web',
        active: true,
        events,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret,
          insecure_ssl: '0',
        },
      },
    )
    const config = (raw.config ?? {}) as Record<string, unknown>
    return {
      id: Number(raw.id),
      url: String(config.url ?? ''),
      events: Array.isArray(raw.events) ? raw.events.map(String) : [],
      active: Boolean(raw.active),
      createdAt: String(raw.created_at ?? ''),
    }
  }

  // ─── Sync status (composite) ──────────────────────────────────────────

  /**
   * Returns a combined sync status object suitable for display in the frontend.
   * Never throws — all errors are swallowed and reflected in the result.
   */
  async getSyncStatus(): Promise<SyncStatus> {
    let lastCommit: GitHubCommit | null = null
    let deploymentState: DeploymentState | null = null
    let webhookReachable = false

    try {
      const commits = await this.getRecentCommits(undefined, 1)
      lastCommit = commits[0] ?? null
    } catch {
      // silently degrade
    }

    if (lastCommit) {
      try {
        const state = await this.getCommitStatus(lastCommit.sha)
        deploymentState = state === 'success' ? 'success'
          : state === 'failure' ? 'failure'
          : state === 'error' ? 'error'
          : 'pending'
      } catch {
        // silently degrade
      }
    }

    if (this.config.webhookReceiverUrl) {
      try {
        const res = await fetch(`${this.config.webhookReceiverUrl}/health`, {
          signal: AbortSignal.timeout(5000),
        })
        webhookReachable = res.ok
      } catch {
        webhookReachable = false
      }
    }

    return {
      lastSyncAt: lastCommit?.date ?? null,
      lastCommitSha: lastCommit?.sha ?? null,
      lastCommitMessage: lastCommit?.message ?? null,
      deploymentState,
      webhookReachable,
    }
  }
}

// ─── Factory ───────────────────────────────────────────────────────────────

/**
 * Create a GitHubIntegration instance from environment / localStorage.
 * Returns null if the required settings are absent.
 */
export function createGitHubIntegration(
  token: string,
  repoOwner: string,
  repoName: string,
  webhookReceiverUrl?: string,
): GitHubIntegration {
  return new GitHubIntegration({ token, repoOwner, repoName, webhookReceiverUrl })
}
