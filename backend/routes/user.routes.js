const express=require('express');
const router=express.Router();
const userController=require('../controllers/user.controller')
const authmiddleware=require('../middlewares/authentication.middleware')
const { body } = require("express-validator");

router.post('/register' ,body('email').isEmail().withMessage('Email must be a valid email address'),
body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),userController.createuserController);

router.post('/login',body('email').isEmail().withMessage('Email must be a valid email address'),
body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),userController.loginUserController)

router.get('/getProfile',authmiddleware.authUser,userController.profileUserController)
router.get('/logout',authmiddleware.authUser,userController.logoutController);

router.get('/all',authmiddleware.authUser,userController.getAllUsers);
module.exports=router;