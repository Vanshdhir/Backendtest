const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/Auth');
const cors = require('cors');


const db = require('./db');


const app = express()
app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!')
})


//Routes
app.use('/auth', auth);



const port = process.env.PORT;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})