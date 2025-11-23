const express=require('express')
const {testController}=require('../Controllers/testController')


//route object
const router=express.Router()

router.get('/test',testController)

module.exports= router;