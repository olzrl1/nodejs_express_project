const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000
mongoose.connect('mongodb+srv://LJW:qwe123@boilerplate.lki1juf.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('MongoDB Connecting!'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('TEST!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))