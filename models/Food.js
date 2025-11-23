const mongoose=require('mongoose')

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, " Food name is mandatory"] },
    description: { type: String, required: [true, "description is mandatory"] },
    price: { type: Number, required: [true, "Price is mandatory"] },
    image: { type: String, required: [true, "food image is mandatory"] },
    category: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "app", required:[true] },
  },
  { timestamps: true }
);

module.exports=mongoose.model("Food",FoodSchema)