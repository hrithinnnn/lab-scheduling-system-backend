const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    registerUser: async (req, res) =>{
        try {
            const {username, email, password,role,instituition,phone} = req.body;
            const user = await Users.findOne({email: email})
            if(user) return res.status(400).json({msg: "The email already exists."})

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                username: username,
                email: email,
                password: passwordHash,
                role:role,
                instituition:instituition,
                phone:phone
            })
            await newUser.save()
            res.status(200).json({status:"success",message: "Sign up Success"})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    loginUser: async (req, res) =>{
        try {
            const {email, password} = req.body;
            const user = await Users.findOne({email: email})
            if(!user) return res.status(401).json({status:"failure", message: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(402).json({status:"failure", message: "Incorrect password."})

            // if login success create token
            const payload = {id: user._id, name: user.username}
            const token = jwt.sign(payload, process.env.TOKEN_SECRET) //{expiresIn: "1d"}

            res.status(200).json({status:"success",token})
        } catch (err) {
            return res.status(500).json({status:"failure", message: err.message})
        }
    },
    updateProfile: async (req,res) =>{
        try {
            const {email, password,username,role,instituition,phone} = req.body;
            const user = await Users.findOne({email: email});
            if(!user) return res.status(400).json({status:"failure", message: "User does not exist."})

            const isMatch = (password===user.password) ? true:false;
            if(!isMatch) return res.status(400).json({status:"failure",message: "Incorrect password."})

            const docs= await Users.updateOne({email:email},
                {$set:{username,role,instituition,phone}})
                res.status(200).json({status:"success",message:"success"});
        }catch (err) {
            return res.status(500).json({status:"failure", message: err.message})
        }
    },
    changePassword: async (req,res)=> {
        try{
            const {email, oldPassword, newPassword} = req.body;
            const user = await Users.findOne({email: email})
            if(!user) return res.status(401).json({status:"failure",message: "User does not exist."})

                const isMatch = await bcrypt.compare(oldPassword, user.password)
                if(!isMatch) return res.status(401).json({status:"failure",message: "Incorrect password."})

            const passwordHash = await bcrypt.hash(newPassword, 10)
            const docs= await Users.updateOne({email:email},
                {$set:{password:passwordHash}},{multi:true})
                res.status(200).json({status:"success",docs,message:"successfully updated password"});

        } catch(err){
            res.status(500).json({status:"failure",docs,message:err.message});
        }
    },
    verifiedToken: (req, res) =>{
        try {
            const token = req.header("Authorization")
            if(!token) return res.send(false)

            jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) =>{
                if(err) return res.send(false)

                const user = await Users.findById(verified.id)
                if(!user) return res.send(false)

                return res.send(true)
            })
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    verifyUser: (req, res) =>{
        try {
            const token = req.header("Authorization")
            console.log("user", token)
            if(!token) return res.status(210).json({status:"failure",message:"no token found"})

            jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) =>{
                if(err) return res.status(400).json({status:"failure",message:"token error"})


                const user = await Users.findById(verified.id)
                if(!user)  return res.status(400).json({status:"failure",message:"no user found"})
                return res.status(200).json(user);
            })
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    deleteProfile: async(req, res) =>{
        try {
            const email=req.params.email;
            console.log(email)
            await Users.deleteOne({email:email})
            res.status(200).json({status:"success",message: "Deleted user: ",email})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
}


module.exports = userCtrl