const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const saveData  = require('./route/saveData')
const updateData = require('./route/updateData')
require('dotenv').config(); 


const app = express()

const PORT = process.env.PORT; 

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})

// middleware
app.use(morgan('dev'))
app.use(express.json({limit:'20mb'}))
app.use(express.urlencoded({limit:'20mb',extended:true}));
app.use(cookieParser());
app.use(cors('*')); 

app.use((req,res,next)=>{
    next();
}); 

app.use('/save',saveData)
app.use('/update',updateData)