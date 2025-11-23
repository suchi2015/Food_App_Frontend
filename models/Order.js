const mongoose=require('mongoose')
// const User=require('./User')
// const Food=require('./Food')

const OrderSchema= new mongoose.Schema({
    UserId:{type:mongoose.Schema.Types.ObjectId , ref:"app", required:true},
    items:[
        {
            foodId:{type:mongoose.Schema.Types.ObjectId, ref: "Food", required:true},
            Quantity:{type:Number, required:true, default:1}
        },
    ],
    totalAmount:{type:Number, required:true},
    status:{
        type:String,
        enum:['pending', 'preparing', 'out-for-delivered', 'delivered', 'cancelled'],
        default:'pending'
    }
},{timestamps:true})

module.exports=mongoose.model("Order",OrderSchema)