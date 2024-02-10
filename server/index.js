require("dotenv").config()
const express = require('express')
const {connectToMongoDB} = require('./database')

const app = express()
app.use(express.json())

const router = require('./routes')
app.use('/api',router)



async function startServer(){
    await connectToMongoDB()
    const port = process.env.PORT || 5000
    app.listen(port,()=>{
        console.log(`listening on https://localhost:${port}`)
    })
}

startServer()
