const jwt = require("jsonwebtoken")
const blackListModel = require("../models/blacklist.model")
const redis = require("../config/cache")

async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({
            message:"token is not valid"
        })
    }

    const isAlreadyBlacklisted = await redis.get(token)

    if(isAlreadyBlacklisted){
        return res.status(401).json({
            message:"token is already expired"
        })
    }

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )
        req.user = decoded

        next()
    } catch (err){
        return res.status(401).json({
            message:"invalid token"
        })
    }
}

module.exports = { authUser }