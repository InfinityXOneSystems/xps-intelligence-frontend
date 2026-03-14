// API Configuration
// This is read from environment variables set in .env files

export const API_CONFIG = {
  // Backend API URL - MUST use env variable
  API_URL: import.meta.env.VITE_API_URL || (() => {
    const fallback = 'https://xpsintelligencesystem-production.up.railway.app/api'
    console.warn(
      '[XPS CONFIG] VITE_API_URL not set, using fallback: ' + fallback
    )
    return fallback
  })(),

  // WebSocket URL
  WS_URL: import.meta.env.VITE_WS_URL || (() => {
    const fallback = 'wss://xpsintelligencesystem-production.up.railway.app'
    console.warn(
      '[XPS CONFIG] VITE_WS_URL not set, using fallback: ' + fallback
    )
    return fallback
  })(),

  // App metadata
  APP_NAME: 'XPS Intelligence',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'production',
}

// Log config on startup (production)
if (import.meta.env.PROD) {
  console.log('[XPS] Configuration loaded:', {
    api: API_CONFIG.API_URL,
    ws: API_CONFIG.WS_URL,
    env: API_CONFIG.ENVIRONMENT,
  })
}
