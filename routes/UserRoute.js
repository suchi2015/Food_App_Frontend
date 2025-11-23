const express=require('express')
const UserController=require('../Controllers/UserController')
const router=express.Router()

router.post('/register',UserController.Register)
router.post('/login',UserController.Login)

module.exports=router