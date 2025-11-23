const { required } = require("joi")
const mongoose=require("mongoose")

const CartSchema=new mongoose.Schema({
    UserId:{type:mongoose.Schema.Types.ObjectId, ref:"app", required:true},
    items:[
        {
            
            foodId:{type:mongoose.Schema.Types.ObjectId, ref: "Food", required:true},
            quantity:{type:Number, required:true, default:1}
        
        }
    ]

})

module.exports = mongoose.model("Cart", CartSchema);