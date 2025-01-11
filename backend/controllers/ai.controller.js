const aiservice = require('../services/ai.service');


const getAiResult=async(req,res)=>{
     try{
        const email=req.user;
        const {message}=req.body;
        const result=await aiservice.generateResult(message)
        res.status(200).json({result})
     }catch(err){
        console.log(err)
        res.status(400).json({error:err.message})
     }
}

module.exports={
    getAiResult
}