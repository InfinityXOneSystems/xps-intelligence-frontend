import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.AI_GROQ_API_KEY) {
    return res.status(503).json({ error: 'LLM not configured — AI_GROQ_API_KEY is missing' })
  }

  try {
    const groq = new Groq({
      apiKey: process.env.AI_GROQ_API_KEY
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Hello from Vercel!" }
      ]
    });

    res.status(200).json({
      message: response.choices[0]?.message?.content || 'Empty response from LLM'
    });

  } catch (error) {
    console.error('Groq test error:', error);
    res.status(500).json({
      error: error.message
    });
  }
}
