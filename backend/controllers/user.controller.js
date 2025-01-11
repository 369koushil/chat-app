const userModel = require('../db/models/user.model')
const userService = require('../services/user.service')
const { validationResult } = require('express-validator');
const redisService=require('../services/redis.service')

redisService.redisClient;

const createuserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        
        const token=user.generateJWT();
        console.log({user,token})
        res.status(201).json({user,token});
    } catch (error
    ) {
        res.status(400).send(error.message)
    }
}

const loginUserController=async (req,res)=>{
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors.array() });
    }

    try{
     const {email,password}=req.body;
     const user=await userModel.findOne({email}).select("+password");
     console.log(user);
     if(!user){
        res.status(401).json({error:"invalid credintals"})
     }
     
     const isMatch=await user.isValidPassword(password);
    //  console.log(isMatch);
     if(!isMatch){
        res.status(401).json({error:"invalid credintals"})
     }

     const token=await user.generateJWT();
    //  console.log({user ,token})
     res.status(200).json({user,token})

    }catch(err){
      res.send(err)
    }
}

const profileUserController=async (req,res)=>{
    const email=req.user;
    const userData=await userModel.findOne({email})
   
     res.status(200).send({data:userData})
}


const logoutController =async(req,res)=>{
    try{
        const token=req.headers.authorization.split(' ')[1]||req.cookies.token

        redisService.redisClient.set(token,'logout','EX',60*60*24)

        res.status(200).json({
            msg:"logout successfully"
        })
    }catch(err){
        // console.log(err)
        return res.status(400).json({error:"error while logout"})
    }
}

const getAllUsers=async(req,res)=>{

    try{
        const email=req.user;
        const user=await userModel.findOne({email});
        console.log(user)
        const allUsers=await userService.getAllUsers(user._id.toString());
        
        return res.status(200).json({users:allUsers})
    }catch(err){
        res.status(400).send(err.message)
}

}

module.exports={
    createuserController,loginUserController,profileUserController,logoutController,getAllUsers
}