
const mongoose=require('mongoose')

const TestSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'username is mandatory']
    },
     email:{
        type:String,
        required:[true, 'Email is mandatory'],
        unique:true
    },
     password:{
        type:String,
        required:[true, 'password is mandatory']
    },
     address:{
        type:Array,
        
    },
    Phone:{
        type:String,
        required:[true, 'Phone is mandatory']
    },
    UserType:{
        type:String,
        required:[true, 'user type is mandatory'],
        default:'client',
        enum:['client', 'admin','vendor','driver']
    },
    profile:{
        type:String,
        deafult:'https://www.google.com/imgres?q=profilepic%20default&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F020%2F765%2F399%2Fsmall_2x%2Fdefault-profile-account-unknown-icon-black-silhouette-free-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&docid=--oA6_9U9ufzsM&tbnid=bowkO_GA3uhk3M&vet=12ahUKEwjvpYnRha2PAxUK4TgGHRnHAAYQM3oECBYQAA..i&w=400&h=400&hcb=2&ved=2ahUKEwjvpYnRha2PAxUK4TgGHRnHAAYQM3oECBYQAA'
    }
    
    
},{timestamps:true}
    
)

module.exports=mongoose.model('TestModel',TestSchema)