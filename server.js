const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./router/staffRoute');
const studentRouter = require('./router/studentRoute');
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = 6540;

const app = express();
app.use(express.json());
app.use(router);
app.use(studentRouter);

app.use((err,req,res,next)=>{
    if(err)
        return res.status(400).json({
            message: err.message
        })
    next()
})


mongoose.connect(DATABASE_URL).then(()=>{
    console.log('Database connected successfully');
    
    app.listen(PORT, ()=>{
        console.log(`Server is listening to PORT:${PORT}`)
        
    })
    
}).catch((error)=>{
    console.error('Unable to connect to Database successfully ' + error.message);
  
})