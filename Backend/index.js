require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./routes/userRouter')
const requestRouter = require('./routes/requestRouter')
const labRouter = require('./routes/labRouter')
const path = require('path')


const app = express()
app.use(cors())
app.use(express.json())


// Routes
app.use('/users', userRouter)
app.use('/requests', requestRouter)
app.use('/lab', labRouter)
app.get("/test/:id",(req,res)=>{
    res.json({id:req.params.id})
})

// Connect to MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI).catch((err)=>{
    console.log("cannot connect to server:" ,err);
});

app.get('/',(req,res)=>{
    res.status(200).json("server is running")
})

// Listen Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})



/* {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, */