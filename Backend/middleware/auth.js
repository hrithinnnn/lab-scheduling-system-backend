const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        console.log("token",token);
        if(!token) return res.status(400).json({status:"failure",message: "Invalid Authentication"})

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({status:"failure",message: "Authorization not valid."})

            req.user = user;
            next()
        })
    } catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
    }
}

module.exports = auth