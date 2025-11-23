const express = require("express");
const Foods = require("../models/Food");

const Add_food = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const imagepath = req.file ? "uploads/" + req.file.filename : null;
    if (!imagepath) {
      return res.status(400).json({ message: "food image is mandatory" });
    }
    const adminId = req.user?.id;
    if (!adminId) {
      return res
        .status(400)
        .json({ message: " Unauthorized admin id missing" });
    }
    const Food_item = new Foods({
      name,
      description,
      price,
      category,
      image: imagepath,
      adminId: adminId,
    });
    await Food_item.save();
    res.status(200).json({ message: "food item added successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
    console.error("error ocurred", error);
  }
};

const display_all = async (req, res) => {
  try {
    const foodItem = await Foods.find();
    if (!foodItem || foodItem.length === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }
    await res.status(200).send(foodItem);
  } catch (error) {
    res.status(400).json({ message: "server error" });
    console.error("error ocurred ", error);
  }
};

const getFoodsByAdmin = async (req, res) => {
  try {
    // const {adminId} = req.params
    const { id } = req.user;

    const foods = await Foods.find({
      adminId: id
    });

    res.status(200).json(foods);
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ message: err.message });
  }
};

const get_item = async (req, res) => {
  try {
    const item = await Foods.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "food item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: " food server error" });
    console.error("error occured", error);
  }
};

// const Update=async(req,res)=>{
//     try{
//         const
//     }
// }

module.exports = { Add_food, getFoodsByAdmin, display_all, get_item };
