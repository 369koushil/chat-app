const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minLength:[6,'email must be atleast 6 char'],
        maxLength:[50,'email must not longer than 50 char']
    },
    password:{
        type:String,
        required:true,
        select:false
    }

})


userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassowrd=async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.generateJWT=function(){
    return jwt.sign({email:this.email},process.env.SECRET,{expiresIn:'24h'});
}

const User=mongoose.model('user',userSchema);

module.exports=User;