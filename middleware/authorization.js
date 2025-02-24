const jwt = require('jsonwebtoken');
const staffModel = require('../model/staffModel');
const { keys } = require('lodash');
require('dotenv').config();
const key = process.env.key
exports.checkRole = async (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(404).json({
            message:"Kindly Login to perform this Action"
        })
    }
    const checkToken = req.headers.authorization.split(" ")[1]
   const tokenOwner = await jwt.verify(checkToken, key, (error, data)=>{
       if(error){ 
        return res.status(400).json({
            message: error.message
        })
        }
        return data
    })
    console.log(tokenOwner )
    const checkUser = await staffModel.findById(tokenOwner.id)
    if(!checkUser){
        return res.status(404).json({
            message: "staff Not Found"
        })
    }else if(checkUser.isSuperAdmin === true){
        next()
       
    }else{
        return res.status(401).json({
            message: "You Are Not Authorize for this Action"
        })
    }
}
exports.adminRole = async (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(404).json({
            message:"Kindly Login to perform this Action"
        })
    }
    const checkToken = req.headers.authorization.split(" ")[1]


   const tokenOwner = await jwt.verify(checkToken, key, (error, data)=>{

       if(error){ 
        return res.status(400).json({
            message: error.message
        })

        }
        return data
    })
    console.log(tokenOwner )
    const checkUser = await staffModel.findById(tokenOwner.id)
    if(!checkUser){
        return res.status(404).json({
            message: "Staff Not Found"
        })
    }else if(checkUser.isAdmin === true){
        next()
       
    }else{
        return res.status(401).json({
            message: "You Are Not Authorize for this Action"
        })
    }
}


