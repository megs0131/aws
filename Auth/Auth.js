const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const jwtSecret = process.env.jwtSecret

// Register function
exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 10) {
        return res.status(400).json({ message: "Password is less than 10 characters" });
    }
    // Hashing password
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            username, 
            password: hash,
        }).then(user => {

            const maxAge = 3*60*60;
            const token = jwt.sign({id: user._id, username, role: user.role},
                jwtSecret, {expiresIn: maxAge})
            
        res.cookie("jwt", token, {
             httponly : true,
            maxAge : maxAge*1000
        })
            res.status(200).json({
                message: "User successfully created", 
                user: user._id, token, 
            })
        })
        .catch((error) => 
            res.status(401).json({
                message: "User cannot be created", 
                error: error.message
            })
        );    
    });
};

// Login function
exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username or Password is incorrect" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Login unsuccessful", error: "User not found" });
        } else {
            bcrypt.compare(password, user.password).then(function(result) {
                if(result) {
                    const maxAge = 3*60*60;
                    const token = jwt.sign({id: user._id, username, role: user.role},
                        jwtSecret, {expiresIn: maxAge})
                    
                res.cookie("jwt", token, {
                     httponly : true,
                    maxAge : maxAge*1000
                })
                    res.status(200).json({ message: "Login Successful", user: user._id, token })
            }    
                    else { 
                        res.status(400).json({ message: "Login Unsuccessful" });
                    }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error occurred",
            error: error.message
        });
    }
};

// Privilege update function
exports.update = async (req, res, next) => {
    const { role, id } = req.body;

    if (!role || !id) {
        return res.status(400).json({ message: "Role or ID is missing" });
    }

    if (role !== "admin") {
        return res.status(400).json({ message: "Invalid role. Only 'admin' role can be assigned." });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "User is already an Admin" });
        }

        user.role = role;
        await user.save();
        return res.status(200).json({ message: "Update successful", user });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Delete function
exports.deleteUser = async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID is missing" });
    }

    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id); 
        return res.status(200).json({ message: "User deletion successful" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

















// Get users function
exports.getUsers = async (req, res, next) => {
    await User.find({})
        .then(users => {
            const userFunction = users.map(user => {
                const container = {};
                container.username = user.username;
                container.role = user.role;
                return container;
            });
            res.status(200).json({ user: userFunction });
        })
        .catch(err => res.status(401).json({
            message: "Not successful", 
            error: err.message
        }));
};
