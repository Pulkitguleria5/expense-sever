import express from 'express'

const app = express()
const arr = [];
app.use(express.json())

app.post("/register",(req,res)=>{
    const {name,email} = req.body
    //check if user already exists
    
    

    const user = arr.find((user)=> user.email === email  && user.name === name)
    if(user){
        return res.status(200).send("User already exists")
    }

    
    const userobj = {name,email};
    arr.push(userobj);
     res.status(400).send(`${name}  ${email}`)
})

app.get('/',(req,res)=>{
     res.status(200).send("hello world")
})

app.listen(3000)