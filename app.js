const express = require('express');
const app = express();
const env = require('dotenv').config();
const connectDB = require('./config/db');


connectDB();




app.listen(process.env.PORT, () => {console.log(`Server is running on port 3000`)});


module.exports = app;