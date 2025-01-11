const express=require('express');
const router=express.Router();
const aiServecie=require('../services/ai.service')
const authmiddleware=require('../middlewares/authentication.middleware')
const aicontroller=require('../controllers/ai.controller')


router.get('/get-ai-result',authmiddleware.authUser,aicontroller.getAiResult)


module.exports=router