const { default: mongoose } = require('mongoose')
const projectModel=require('../db/models/project.model')


const createProject=async({name,userId})=>{

// console.log(name)
// console.log(userId)
    if(!name){
        throw new Error('name req')
    }

    if(!userId){
        throw new Error('id req')
    }
let project;

   try{
    project=await projectModel.create({
        name,
        users:[userId]
    });

    // console.log(project)
    // console.log('hello')
   }catch(err){
    if(err.code===11000){
        throw new Error ('project name already exists ')
    }
    throw err;
   }

    return project
}

const getAllProjects=({userId})=>{
    if(!userId){
        throw new Error('id req')
    }

   try{
    const allUserProjects=await =projectModel.find({
        users:userId
    })

    return allUserProjects;
   }
   catch(err){
    throw err;
   }
}

const addUser=async({projectId,users,userId})=>{
    if(!projectId){
        throw new Error('pid req')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('invalid pid')
    }
    if(!users){
        throw new Error('users req')
    }

    if(!Array.isArray(users)||users.some(userid=>!mongoose.Types.ObjectId.isValid(userid))){
        throw new Error('invalid uid')
    }


    try{
        const project=await projectModel.findOne({
            _id:projectId,
            users:userId
        })

        if(!project){
            throw new Error('user not belongs to projects')
        }

        const updatedP=await projectModel.findOneAndUpdate({
            _id:projectId
        },{
            $addToSet:{
                users:{
                    $each:users
                }
            }
        },{
            new:true
        })

        return updatedP;

    }catch(err){
        throw err
    }
}


const getProject=async({projectId,userId})=>{   
   
    if(!projectId){
        throw new Error('pid req')
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('invalid pid')
    }
    if(!userId){
        throw new Error('uid req')
    }

    try{
        const project=await projectModel.findOne({
            _id:projectId,
            users:userId
        }).populate('users','email')

        if(!project){
            throw new Error('user not belongs to projects')
        }

        return project;

    }catch(err){
        throw err
    }

}
module.exports={
    createProject,getAllProjects,addUser,getProject
}