const express=require('express')
const router=express.Router()
const AuthController=require('../Controllers/AuthController')

router.post('/register',AuthController.userRegister);
router.post('/login',AuthController.userLogin)


module.exports=router