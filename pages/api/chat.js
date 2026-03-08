import { Groq } from 'groq-sdk'

export default async function handler(req,res){

const groq = new Groq({
apiKey:process.env.AI_GROQ_API_KEY
})

const {message}=req.body

const response=await groq.chat.completions.create({
model:"llama-3.3-70b-versatile",
messages:[{role:"user",content:message}]
})

res.json({
reply:response.choices[0].message.content
})
}
