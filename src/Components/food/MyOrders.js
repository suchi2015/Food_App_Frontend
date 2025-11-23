import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Paper } from "@mui/material";
import { toast } from "react-toastify";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/order/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        
        const cleanedOrders = res.data.orders.map((order) => ({
          ...order,
          items: order.items.filter((item) => item.foodId !== null),
        }));

        setOrders(cleanedOrders);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          My Orders
        </Typography>

        {orders.length === 0 ? (
          <Typography>No orders yet</Typography>
        ) : (
          orders.map((order) => (
            <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
              <Typography>Items:</Typography>
              {order.items.map((item, idx) => (
                <Typography color="secondary" key={item.foodId?._id || idx}>
                  - {item.foodId ? item.foodId.name : "Food removed"} x{" "}
                  {item.Quantity}
                </Typography>
               
                // <Box
                //                 onClick={() => setSelected(food)}
                //                 component="img"
                //                 src={`http://localhost:8080/${food.image}`}
                //                 alt={food.name}
                //                 height={200}
                //                 width="100%"
                //                 // sx={{ objectFit: "cover" }}
                //               />
              ))}
              <Typography>Order ID: {order._id}</Typography>
              <Typography>Total: ₹{order.totalAmount}</Typography>
              <Typography>Status: {order.status}</Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default MyOrders;
