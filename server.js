const express = require ("express")
const app = express()
const cookieParser = require("cookie-parser")
const connectDB = require("./Auth/database")
const { adminAuth, userAuth } = require("./middleware/auth")
app.use(express.json())
require('dotenv').config()
app.use(cookieParser());
app.use("/api/auth", require("./Auth/Route"))

app.get("/admin", adminAuth, (req, res) => {
    res.send("Admin Route");
});

app.get("/basic", userAuth, (req, res) => {
    res.send("userAuth Route");
});


connectDB();
const PORT= process.env.PORT
const server= app.listen(PORT,() => console.log(`server is successfully running ${PORT}`))

process.on('unhandledRejection', err => {
    console.log(`error occured: ${err.message}`)
    server.close(() => process.exit(1))
})