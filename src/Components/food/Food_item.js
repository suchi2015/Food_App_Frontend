import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";

const FoodItems = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [orderTotal, setOrderTotal] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [selected, setSelected] = useState(null);
  const [cartAction, setCartAction] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/food/get_all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoods();
  }, []);

  //---------fetch cart from /cart/fetch--------//
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8080/cart/fetch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("res.data", res.data);
        const items = (res.data.items || []).map((i) => ({
          _id: i.foodId._id,
          name: i.foodId.name,
          price: i.foodId.price,
          image: i.foodId.image,
          quantity: i.quantity,
          description:i.description
        }));

        setCart(items);
      } catch (error) {
        console.error("Error while fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  //--------save CART------//
 
  const saveCart = async (updatedCart) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:8080/cart/save",
        {
          items: updatedCart.map((i) => ({
            foodId: i._id,
            quantity: i.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving cart:", err);
    }
  };

  const handleAddToCart = (food) => {
    let updatedCart;
    const exist = cart.find((item) => item._id === food._id);

    if (exist) {
      updatedCart = cart.map((item) =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }];
    }

    setCart(updatedCart);
    saveCart(updatedCart); 
  };

  // const handleRemoveFromCart = (foodId) => {
  //   const updatedCart = cart.filter((item) => item._id !== foodId);
  //   setCart(updatedCart);
  //   saveCart(updatedCart); 
  // };

  const handleRemoveFromCart = (foodId) => {
    setCart(cart.filter((item) => item._id !== foodId));
  };

  // const handlePlaceOrder = async () => {
  //   if (cart.length === 0) return toast.error("Cart is empty!");
  //   console.log("cart", cart);
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return alert("You must be logged in to place an order.");

  //     const res = await axios.post(
  //       "http://localhost:8080/order/order_add",
  //       {
  //         items: cart.map(({ _id, quantity }) => ({
  //           foodId: _id,
  //           Quantity: quantity,
  //         })),
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setOrderTotal(res.data.order.totalAmount);
  //     toast.success(`Order placed! Total: ₹${res.data.order.totalAmount}`);

  //     setCart([]); // clear cart
  //   } catch (err) {
  //     console.error("Error placing order:", err);
  //     toast.error("Failed to place order.");
  //   }
  // };

  const handleSinglePlaceOrder = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:8080/order/order_add",
        { items: [{ foodId: item._id, Quantity: item.quantity }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Order placed for ${item.name}`);
      setCart(cart.filter((c) => c._id !== item._id));
    } catch (err) {
      console.error("Error while placing order:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    toast.info("logged out successfully! see you soon");
  };

  const handleDesc = (desc) => {
    if (!desc) return " ";
    return desc.split(" ").slice(0, 5).join(" ") + "...";
  };

    const handleDescription = (desc) => {
      if (!desc) return " ";
      return desc.split(" ").slice(0, 6).join(" ") + "...";
    };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px", backgroundImage: "bg.jpg" }}>
      {/* Search bar */}
      <Box sx={{ display: "flex", width: "100%", flexDirection: "row" }}>
        <TextField
          fullWidth
          // label="Search food..."
          // width="90%"
          placeholder="Seach your fav food item name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />
        <IconButton sx={{ mb: 4 }} onClick={() => setCartAction(true)}>
          <Badge
            color="secondary"
            badgeContent={cart.reduce((sum, i) => sum + i.quantity, 0)}
          >
            <ShoppingCartIcon color="primary" fontSize="large" />
          </Badge>
        </IconButton>
        <Button
          sx={{ ml: 2, height: "50px" }}
          variant="contained"
          color="success"
          onClick={() => navigate("/myorders")}
        >
          Show My Orders
        </Button>
        <Button
          sx={{ ml: 2, height: "50px" }}
          onClick={handleLogout}
          color="error"
        >
          Logout
        </Button>

        {/* {role === "admin" && (
          <Button
            sx={{ ml: 2, height: "50px" }}
            variant="contained"
            color="secondary"
            onClick={() => navigate("/addfood")}
          >
            Add Food items
          </Button>
        )} */}
      </Box>
      {/* Food items grid */}
      <Grid container spacing={2}>
        {filteredFoods.map((food) => (
          <Grid
            item
            size={{ xs: 12, md: 3, sm: 6, height: "100vh" }}
            key={food._id}
          >
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Box
                onClick={() => setSelected(food)}
                component="img"
                src={`http://localhost:8080/${food.image}`}
                alt={food.name}
                height={200}
                width="100%"
                // sx={{ objectFit: "cover" }}
              />
              <Typography variant="h6">{food.name}</Typography>
              <p>{handleDesc(food.description)}</p>
              <Typography variant="subtitle1">₹{food.price}</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddToCart(food)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Add to Cart
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Cart */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={Boolean(cartAction)}
        onClose={() => setCartAction(null)}
      >
        <DialogTitle>
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 2 }} color="secondary">
              CART
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography>No items in cart.</Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "space-evenly",
                  mb: 1,
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "5px",
                    border: "1px solid Blue",
                  }}
                >
                  <Box
                    component="img"
                    src={`http://localhost:8080/${item.image}`}
                    alt={item.name}
                    height={150}
                    width={150}
                    // marginBottom={2}
                    // maxHeight='300px'
                    // sx={{ objectFit: "cover" }}
                  />

                  <Typography>
                    {item.quantity} *{item.price} =₹{item.price * item.quantity}
                  </Typography>
                </Box>
                <Box sx={{textAlign:"left", display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" color="primary">{item.name}</Typography>
                  <p >{handleDescription(item.description)}</p>
                  <Box>
                    <Button
                      sx={{ mt: 1, mr:2 }}
                      variant="contained"
                      color="error"
                      // size="large"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      // fullWidth

                      sx={{ mt: 1 }}
                      onClick={() => handleSinglePlaceOrder(item)}
                      color="success"
                    >
                      Place Order
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))
          )}

          {cart.length > 0 && (
            <Box
              sx={{ mt: 2, backgroundColor: "lightblue", textAlign: "center" }}
            >
              <Typography variant="h6">
                Total:{" "}
                {orderTotal
                  ? `₹${orderTotal}`
                  : "₹" +
                    cart.reduce((acc, i) => acc + i.price * i.quantity, 0)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mt: 1, width: "200px" }}
            onClick={() => setCartAction(null)}
            color="primary"
          >
            {" "}
            Close
          </Button>
          {/* <Button
            variant="contained"
            // fullWidth

            sx={{ mt: 1, width: "200px" }}
            onClick={handlePlaceOrder}
            color="success"
          >
            Place Order
          </Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DialogTitle>
              <Box
                component="img"
                src={`http://localhost:8080/${selected.image}`}
                alt={selected.name}
                height={200}
                width="100%"
                // maxHeight='300px'
                // sx={{ objectFit: "cover" }}
              />
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6">{selected.name}</Typography>
              <p>{selected.description}</p>
              <Typography variant="subtitle1">₹{selected.price}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}> Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FoodItems;
