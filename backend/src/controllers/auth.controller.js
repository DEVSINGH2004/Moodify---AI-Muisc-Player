const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const blackListModel = require("../models/blacklist.model")
const redis = require("../config/cache")

async function registerController(req,res){
    const {username,email,password} = req.body

    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isAlreadyRegistered){
        return res.status(401).json({
            message:"already exists"
        })
    }

    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id:userModel._id,
        username:user.username
    },process.env.JWT_SECRET_KEY,{
        expiresIn:"3d"
    })

    res.cookie("token",token);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginController(req, res) {
    const { email, password, username } = req.body;

    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    return res.status(200).json({
        message:"user fetched successfully",
        user
    })

}

async function logoutController(req,res){
    const token = req.cookies.token;
    res.clearCookie("token")
    await redis.set(token,Date.now().toString())
    return res.status(200).json({
        message:"logout successfully"
    })
}


module.exports = { registerController, loginController , getMeController,logoutController }