const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');
const { TokenValidation, isAdmin } = require("../middlewares/Validation");

// Place an order (client)
router.post('/order_add', TokenValidation, OrderController.PlaceOrder);

// Get all orders (admin only, can check role in controller)
router.get("/allorders", TokenValidation, isAdmin, OrderController.getOrders);

// Get my orders (client)
router.get('/myorders', TokenValidation, OrderController.getMyOrders);

// Update order status (admin/vendor/driver)
router.put('/update/:id', TokenValidation, OrderController.UpdateOrderStatus);

module.exports = router;
