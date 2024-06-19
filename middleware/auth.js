const jwt = require ("jsonwebtoken")
const jwtSecret = process.env.jwtSecret


exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "Unauthorized access"})
            
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({message: "Unauthorized access"})
                } else{
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({message:" Token Unavailable" })
    }
}




exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "Unauthorized access"})
            
            } else {
                if (decodedToken.role !== "Basic") {
                    return res.status(401).json({message: "Unauthorized access"})
                } else{
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({message:"Token Unavailable"})
    }
}

// Function to promote a user to admin
exports.promoteToAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized access" });
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({ message: "Unauthorized access" });
                } else {
                    const { userId } = req.body;
                    if (!userId || typeof userId !== 'string') {
                        return res.status(400).json({ message: "User ID is required as a string" });
                    }
                    if (!mongoose.Types.ObjectId.isValid(userId)) {
                        return res.status(400).json({ message: "Invalid User ID format" });
                    }
                    try {
                        const user = await user.findById(userId);
                        if (!user) {
                            return res.status(404).json({ message: "User not found" });
                        }
                        user.role = "admin";
                        await user.save();
                        return res.status(200).json({ message: "User promoted to admin successfully", user });
                    } catch (error) {
                        return res.status(500).json({ message: "An error occurred", error: error.message });
                    }
                }
            }
        });
    } else {
        return res.status(401).json({ message: "Token Unavailable" });
    }
};

// Function to get users information
exports.getUsersInfo = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized access" });
            } else {
                try {
                    if (decodedToken.role === "admin") {
                        // Admin can access all users' information
                        const users = await users.find({});
                        return res.status(200).json(users);
                    } else if (decodedToken.role === "Basic") {
                        // Basic users can only access their own ID and name
                        const user = await user.findById(decodedToken._id).select('_id username');
                        if (!user) {
                            return res.status(404).json({ message: "User not found" });
                        }
                        return res.status(200).json(user);
                    } else {
                        return res.status(401).json({ message: "Unauthorized access" });
                    }
                } catch (error) {
                    return res.status(500).json({ message: "An error occurred", error: error.message });
                }
            }
        });
    } else {
        return res.status(401).json({ message: "Token Unavailable" });
    }
};

