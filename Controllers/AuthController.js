const testModule = require("../models/testModule")

const userRegister=async (req,res)=>{
    try{
        const {username,email,password,Phone,address}= req.body
        if(!username || !email || !password || !Phone || !address){
            return res.status(500).send({
                success:false,
                message:'please provide all details'
            })
        }
        //user checking
        const existing = await testModule.findOne({email})
        if(existing){
            return res.status(500).send({
                success:false,
                message:'email already registered'
            })
        }
        const user=await testModule.create({username,email,password,Phone,address})
        res.status(201).send({success:true, message:'registered successfully',user})

    }catch(error){
        res.status(500).send({
            success:'false',
            message:"error in registration API",
            error
        })
        console.log(error)
    }
}

const userLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            res.status(404).send({
                success:false,
                message:'please provide the email or password'
                })
        }

         const existed_user=await testModule.findOne({email:email, password:password})

         if(!existed_user){
            res.status(404).json({message: 'user not found' })
         }
         res.status(200).send({
            success:true,
            message:'user logged in successfully',
            existed_user

         })


    }catch(error){
        res.status(500).json({message:'server error'})
        console.error('error',error)
    }
}

module.exports={userRegister,userLogin}