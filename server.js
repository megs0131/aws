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

app.set("view engine", "ejs")

app.get("/", (req, res) => res.render("home"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))
app.get("/getuser", (req, res) => res.render("user"))
app.get("/admin", adminAuth, (req, res) => res.render("admin"))
app.get("/basic", userAuth, (req, res) => res.render("user"))

connectDB();
const PORT= process.env.PORT
const server= app.listen(PORT,() => console.log(`server is successfully running ${PORT}`))

process.on('unhandledRejection', err => {
    console.log(`error occured: ${err.message}`)
    server.close(() => process.exit(1))
})