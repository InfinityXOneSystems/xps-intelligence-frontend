import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface VaultSecret {
  integration_id: string
  owner_user_id: string
  secret_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function storeSecret(
  integrationId: string,
  ownerUserId: string,
  secretData: Record<string, unknown>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('xps_vault_secrets')
    .upsert({
      integration_id: integrationId,
      owner_user_id: ownerUserId,
      secret_data: secretData,
      updated_at: new Date().toISOString(),
    })
  
  if (error) throw error
}

export async function retrieveSecret(
  integrationId: string,
  ownerUserId: string
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabaseAdmin
    .from('xps_vault_secrets')
    .select('secret_data')
    .eq('integration_id', integrationId)
    .eq('owner_user_id', ownerUserId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data?.secret_data || null
}

export async function deleteSecret(
  integrationId: string,
  ownerUserId: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('xps_vault_secrets')
    .delete()
    .eq('integration_id', integrationId)
    .eq('owner_user_id', ownerUserId)
  
  if (error) throw error
}

export async function isAdmin(userEmail: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('xps_admins')
    .select('email')
    .eq('email', userEmail)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export async function logAudit(
  ownerUserId: string,
  integrationId: string,
  eventType: string,
  payload: Record<string, unknown>
): Promise<void> {
  await supabaseAdmin
    .from('xps_audit_log')
    .insert({
      owner_user_id: ownerUserId,
      integration_id: integrationId,
      event_type: eventType,
      payload,
      created_at: new Date().toISOString(),
    })
}
