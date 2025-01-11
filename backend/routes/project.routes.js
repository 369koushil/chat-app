const express=require('express');
const router=express.Router();
const authmiddleware=require('../middlewares/authentication.middleware')
const projectController=require('../controllers/project.controller');
const { body } = require("express-validator");

router.post('/create',body('name').isString().withMessage('name required'),authmiddleware.authUser,projectController.createProject)

router.get('/all',authmiddleware.authUser,projectController.getAllProjects);

router.put('/add-user',authmiddleware.authUser,projectController.addUser)

router.get('/get-project/:projectId',authmiddleware.authUser,projectController.getProject)

module.exports=router