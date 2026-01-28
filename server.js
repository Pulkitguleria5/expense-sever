const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');


mongoose.connect(process.env.MONGO_DB_CONNECTION_URI)
 .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('Error Connecting to Database: ', error));







const app = express();

app.use(express.json());     // Middleware  to access req.body
app.use(cookieParser());     // Middleware to access cookies

app.use('/auth', authRoutes);
app.use('/group', groupRoutes);

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});





// const app = express()
// const arr = [];
// app.use(express.json())

// app.post("/register",(req,res)=>{
//     const {name,email} = req.body
//     //check if user already exists
//     const user = arr.find((user)=> user.email === email  && user.name === name)
//     if(user){
//         return res.status(200).send("User already exists")
//     }

    
//     const userobj = {name,email};
//     arr.push(userobj);
//      res.status(400).send(`${name}  ${email}`)
// })

// app.get('/',(req,res)=>{
//      res.status(200).send("hello world")
// })

// app.listen(3000)