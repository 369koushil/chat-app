const userModel=require('../db/models/user.model')

 const createUser=async({
    email,password
})=>{
    if(!email||!password){
        throw new Error('email nad password require')
    }
    const hashPassword=await userModel.hashPassowrd(password);
    // console.log(hashPassword)

    const user=await userModel.create({
        email,
        password:hashPassword
    })

    return user;
}

const getAllUsers=async(id)=>{
    
    // console.log(id)
    const users=await userModel.find({
        _id:{$ne:id}
    })
    // console.log(users)
    return users;
}


module.exports={
    createUser,getAllUsers
}