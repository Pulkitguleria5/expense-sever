 

const jwt = require("jsonwebtoken");
const authMiddleware = {
protect: async(req, res, next) => {
    try {
        const token = req.cookies?.jwtToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized"});
        }
        


        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

    }
    catch (error) {
        console.log(error);
        res.status(501).json({ message: "Internal server error",
             error: error.message });
    }
},
};
module.exports = authMiddleware;
