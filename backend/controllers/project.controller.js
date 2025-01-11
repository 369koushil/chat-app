const projectService = require('../services/project.service')
const { validationResult } = require('express-validator');
const projectModel=require('../db/models/project.model')
const userModel=require('../db/models/user.model')

const createProject= async (req,res)=>{
   try{
    const email=req.user;
 
    const {name}=req.body;
     const user=await userModel.findOne({email});
     console.log(user)
      const project=await projectService.createProject({name,userId:user._id})
      console.log(project)

      res.status(200).json({project})
   }catch(err){
    console.log(err)
    res.status(400).send(err.message)
   }
}

const getAllProjects=async(req,res)=>{

    try{
    const email=req.user;
    console.log(email)
    const user=await userModel.findOne({email});
    console.log(user)
    const userId=user._id;
    const allProjects=await projectService.getAllProjects({userId})
   
    return res.status(200).json({projects:allProjects});
    }catch(error){
        return res.status(400).json({error:error.message})
    }
}

const addUser=async(req,res)=>{
try{
    const {projectId,users}=req.body;
    const email=req.user;
  
    const user=await userModel.findOne({email});
    
    const resposne=await projectService.addUser({projectId,users,userId:user._id});
//     console.log(user._id)
//    console.log(resposne)
    return res.status(200).json({project:resposne});
}catch(err){
    return res.status(400).json({error:err.message})
}

}

const getProject=async(req,res)=>{  
    try{
        
       const pId= req.params.projectId;
     
    const email=req.user;
    console.log(email)
    const user=await userModel.findOne({email});
   console.log(user)
    const project=await projectService.getProject({projectId:pId,userId:user._id});

    res.status(200).send(project);
    }catch(err){
        res.status(400).send(err.message)
    }

}


module.exports={
createProject,getAllProjects,addUser,getProject
}