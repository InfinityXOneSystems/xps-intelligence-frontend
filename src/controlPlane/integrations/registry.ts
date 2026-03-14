import type { Integration, IntegrationProvider } from './types'

export const INTEGRATION_REGISTRY: Record<IntegrationProvider, Integration> = {
  github: {
    id: 'github',
    provider: 'github',
    name: 'GitHub',
    description: 'Repository management, workflows, and issues',
    icon: 'GithubLogo',
    status: 'disconnected',
    actions: [
      {
        id: 'list-repos',
        label: 'List Repositories',
        description: 'List all accessible repositories',
        requiresConnection: true,
        endpoint: '/api/integrations/github/repos',
      },
      {
        id: 'list-workflows',
        label: 'List Workflows',
        description: 'List workflows for a repository',
        requiresConnection: true,
        endpoint: '/api/integrations/github/workflows',
      },
      {
        id: 'dispatch-workflow',
        label: 'Trigger Workflow',
        description: 'Dispatch a workflow_dispatch event',
        requiresConnection: true,
        endpoint: '/api/integrations/github/workflow-dispatch',
        method: 'POST',
      },
      {
        id: 'create-issue',
        label: 'Create Issue',
        description: 'Create a new issue in a repository',
        requiresConnection: true,
        endpoint: '/api/integrations/github/issues-create',
        method: 'POST',
      },
    ],
  },
  supabase: {
    id: 'supabase',
    provider: 'supabase',
    name: 'Supabase',
    description: 'Database, auth, and vault management',
    icon: 'Database',
    status: 'disconnected',
    actions: [
      {
        id: 'test-connection',
        label: 'Test Connection',
        description: 'Verify database connectivity',
        requiresConnection: false,
        endpoint: '/api/integrations/supabase/test',
      },
      {
        id: 'list-tables',
        label: 'List Tables',
        description: 'Show all tables in the database',
        requiresConnection: true,
        endpoint: '/api/integrations/supabase/tables',
      },
      {
        id: 'preview-data',
        label: 'Preview Data',
        description: 'View sample rows from a table',
        requiresConnection: true,
        endpoint: '/api/integrations/supabase/preview',
      },
    ],
  },
  vercel: {
    id: 'vercel',
    provider: 'vercel',
    name: 'Vercel',
    description: 'Frontend hosting and deployments',
    icon: 'RocketLaunch',
    status: 'disconnected',
    actions: [
      {
        id: 'list-projects',
        label: 'List Projects',
        description: 'Show all Vercel projects',
        requiresConnection: true,
        endpoint: '/api/integrations/vercel/projects',
      },
      {
        id: 'list-deployments',
        label: 'List Deployments',
        description: 'Show deployments for a project',
        requiresConnection: true,
        endpoint: '/api/integrations/vercel/deployments',
      },
      {
        id: 'redeploy',
        label: 'Trigger Redeploy',
        description: 'Redeploy a project',
        requiresConnection: true,
        endpoint: '/api/integrations/vercel/redeploy',
        method: 'POST',
      },
    ],
  },
  railway: {
    id: 'railway',
    provider: 'railway',
    name: 'Railway',
    description: 'Backend hosting health checks',
    icon: 'Train',
    status: 'disconnected',
    actions: [
      {
        id: 'health-check',
        label: 'Health Check',
        description: 'Test backend health endpoint',
        requiresConnection: false,
        endpoint: '/api/integrations/railway/test',
      },
    ],
  },
  groq: {
    id: 'groq',
    provider: 'groq',
    name: 'Groq LLM',
    description: 'Fast LLM inference for chat',
    icon: 'Brain',
    status: 'disconnected',
    actions: [
      {
        id: 'test-chat',
        label: 'Test Chat',
        description: 'Send a test message',
        requiresConnection: true,
        endpoint: '/api/llm/chat',
        method: 'POST',
      },
    ],
  },
}

export function getIntegration(provider: IntegrationProvider): Integration {
  return INTEGRATION_REGISTRY[provider]
}

export function getAllIntegrations(): Integration[] {
  return Object.values(INTEGRATION_REGISTRY)
}
