const express=require("express")
const router=express.Router()
const cartController=require("../Controllers/CartController")
const { TokenValidation } = require("../middlewares/Validation");

router.post("/save", TokenValidation, cartController.SaveCart);
router.get("/fetch", TokenValidation, cartController.FetchCart);

module.exports=router