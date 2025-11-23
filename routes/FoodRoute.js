const express = require("express");
const router = express.Router();
const FoodController = require("../Controllers/FoodController");
const { TokenValidation, isAdmin } = require("../middlewares/Validation");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post(
  "/add",
  TokenValidation,
  isAdmin,
  upload.single("image"),
  FoodController.Add_food
);

router.get("/foods", TokenValidation, FoodController.getFoodsByAdmin);
router.get("/get_all", FoodController.display_all);
router.get("/item/:id", FoodController.get_item);

module.exports = router;
