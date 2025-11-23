const express=require('express')
const jwt=require('jsonwebtoken')
const User=require('../models/User')
const dotenv=require('dotenv')
const {UserValidation}=require('../middlewares/Uservalidation')
const bcrypt=require('bcryptjs')

dotenv.config()
const Secret=process.env.Secret_key



const Register = async (req, res) => {
  try {
    const { value, error } = UserValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Invalid validation",
        errors: error.details.map((e) => e.message),
      });
    }

    // Check if user exists
    const existing = await User.findOne({ email: value.email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create user
    const user_details = new User({
      ...value,
      password: hashedPassword,
    });
    await user_details.save();
    // await User.create({
    //   ...value,
    //   password: hashedPassword,
    // });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error occurred during register:", error);
    res.status(500).json({ message: "Server error" });
  }
};




const Login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({message:'Email not found. '})
        }

        const valid=await bcrypt.compare(password,user.password );
        if(!valid) return res.status(401).json({message:'Wrong password'})

            // const payload={}
            const token=jwt.sign(
                {id:user._id, email:user.email, name:user.name, role:user.role},
                Secret,
                {expiresIn:'1h'}

            )
            ///////////
            // const accessToken = jwt.sign(
            //   { id: user._id },
            //   process.env.JWT_SECRET,
            //   { expiresIn: "15m" }
            // );
            // const refreshToken = jwt.sign(
            //   { id: user._id },
            //   process.env.JWT_REFRESH_SECRET,
            //   { expiresIn: "7d" }
            // );

            // store refreshToken in DB or memory
            // res.json({ accessToken, refreshToken });

            ////////////
            res.status(200).json({token,message:'User Login succesfully',user,role:user.role})

    }catch(error){
        res.status(500).json({message:'server Error'});
        console.error('error occured', error)
    }
}

module.exports={Register,Login}