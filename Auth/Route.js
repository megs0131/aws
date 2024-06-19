const express = require( "express")
const{adminAuth} = require("../middleware/auth")
const authController = require("../middleware/auth");
const router = express.Router()
const {register, login, update, deleteUser, getUsers} = require('./Auth')
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/update").put(adminAuth,update)
router.route("/delete").delete(adminAuth, deleteUser)
router.post("/promote-to-admin", authController.adminAuth, authController.promoteToAdmin);
router.route("/getUsers").get(getUsers)
router.get("/users", authController.getUsersInfo);
module.exports = router