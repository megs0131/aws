const mongoose = require ("mongoose")
require('dotenv').config()
const MongoDB = process.env.MOGO_URL
const connectDB = async () => {
    await mongoose.connect(MongoDB, {

     
    })
    console.log("MongoDB is connected")
}

module.exports = connectDB