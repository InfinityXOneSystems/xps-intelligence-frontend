import { Groq } from 'groq-sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.AI_GROQ_API_KEY) {
    return res.status(503).json({ error: 'LLM not configured — AI_GROQ_API_KEY is missing' })
  }

  try {
    const groq = new Groq({ apiKey: process.env.AI_GROQ_API_KEY })
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Hello from Vercel!' }],
      max_tokens: 256,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return res.status(502).json({ error: 'Invalid response structure from LLM' })
    }
    return res.status(200).json({ message: content })
  } catch (error) {
    console.error('Groq test error:', error)
    return res.status(500).json({ error: 'LLM request failed', details: error.message })
  }
}
