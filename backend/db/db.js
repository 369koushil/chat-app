const mongoose=require('mongoose');

function connect(){
    mongoose.connect(process.env.MONGO_URI).then((c)=>{
       console.log(`succesfully connected to host ${c.connection.host}`)
       }).catch(err=>{
        console.log(`error occured while connecting -->${err}`)})

}

module.exports=connect;