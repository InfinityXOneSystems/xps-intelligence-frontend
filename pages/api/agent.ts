export default async function handler(req, res){

const backendUrl = process.env.BACKEND_URL || 'https://xps-intelligence-system.up.railway.app'

const message=req.body.message

const result=await fetch(`${backendUrl}/api/agent`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({message})
})

const data=await result.json()

res.json(data)

}
