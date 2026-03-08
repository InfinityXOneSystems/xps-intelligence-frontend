export default async function handler(req,res){

const message=req.body.message

const result=await fetch("http://backend:8000/agent",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({message})
})

const data=await result.json()

res.json(data)

}
