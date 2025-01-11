
const express=require('express');
const app=express();
const cors=require('cors')
const cookie=require('cookie-parser');
const morgan=require('morgan');
const userRoutes=require('./routes/user.routes')
const projectRoutes=require('./routes/project.routes')
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use("/user",userRoutes);
app.use('/project',projectRoutes)
module.exports=app;
