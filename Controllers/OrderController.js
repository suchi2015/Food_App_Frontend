const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Food = require("../models/Food");
dotenv.config();

// ======================== Place Order ========================
const PlaceOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res
          .status(404)
          .json({ message: `Food not found: ${item.foodId}` });
      }
      console.log("item", item);
      // ✅ schema expects "quantity"
      const qty = item.Quantity || 1;

      totalAmount += food.price * qty;

      orderItems.push({
        foodId: food._id,
        Quantity: qty,
      });
    }

    const order = new Order({
      UserId: req.user?.id || req.body.UserId, // token userId if available
      items: orderItems,
      totalAmount,
      status: req.body.status || "pending",
    });

    await order.save();
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================== Get Orders (role-based) ========================
const getOrders = async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const orders = await Order.find()
      .populate("UserId", "name email")
      .populate("items.foodId", "name price");
      // console.log(req.user)
      // console.log("all order hit")

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ======================== Get My Orders ========================
const   getMyOrders = async (req, res) => {
  try {
    const UserId = req.user.id;
    const orders = await Order.find({ UserId })
      .populate("items.foodId", "name price")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No items ordered yet" });
    }

    res.status(200).send({
      message: "Your orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================== Update Order Status ========================
const UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

 
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
   
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
   
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error while updating order" });
  }
};



module.exports = { PlaceOrder, getOrders, getMyOrders, UpdateOrderStatus };
