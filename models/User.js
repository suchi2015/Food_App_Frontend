// const express=require('express')
const  mongoose=require('mongoose')

const AdminSchema= new mongoose.Schema({
    name:{type:String, required:[true, 'name is mandatory']},
    email:{type:String, required:[true, 'email is mandatory'], unique:true},
    password:{type:String, required:[true,'password is mandatory']},
    role:{
        type:String,
        required:[true, 'user type is mandatory'],
        
        enum:['client', 'admin'],
        default:'client'
    }
},{timestamps:true})

module.exports=mongoose.model("app",AdminSchema)