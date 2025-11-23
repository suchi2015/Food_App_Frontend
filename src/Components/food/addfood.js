import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// const categories=["snaks","Sweets", "main course", "juice", "ice Creams"]
const AdminDashboard = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showitems, setShowitem] = useState(null);
  const [showOrders, setShowOrders] = useState(null);
  const [page, setPage] = useState(0);
  const rowsperpage = 10;

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit food item
  const handleAddFood = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("image", form.image);

    const adminId = localStorage.getItem("id");
    if (adminId) {
      formData.append("adminId", adminId);
    } else {
      console.error("Admin id missing");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8080/food/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Food item added!");
      await fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error(
        err.res?.dat?.message || "error occured while adding food item"
      );
    }
  };

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/food/foods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/order/allorders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/order/update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   fetchFoods();
  //   fetchOrders();
  // }, []);

  const handleshowFood = async () => {
    await fetchFoods();
    setShowitem(true);
  };

  const handleshowOrders = async () => {
    await fetchOrders();
    setShowOrders(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <Box p={4}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-evenly"}
        width={"100%"}
      >
        <Typography variant="h4" textAlign={"center"}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }} width={"20%"}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            color="primary"
            onClick={handleshowFood}
          >
            Display foods
          </Button>
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            color="success"
            onClick={handleshowOrders}
          >
            Orders
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            LogOut
          </Button>
        </Box>
      </Box>

      {/* Add Food Form */}
      <Paper sx={{ p: 3, mb: 4, mt: 4 }}>
        <Typography variant="h6">Add New Food</Typography>
        <form onSubmit={handleAddFood}>
          <Grid container spacing={2} mt={1}>
            <Grid item size={{ md: 3 }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item size={{ md: 3 }}>
              {/* <TextField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField> */}
              <TextField
                label="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* // {<menuitem>// </menuitem>} */}
            </Grid>
            <Grid item size={{ md: 3 }}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item size={{ md: 3 }}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item size={{ md: 3 }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Food
          </Button>
        </form>
      </Paper>

      {/* Food List */}
      {showitems && (
        <Dialog open={showitems} onClose={() => setShowitem(false)}>
          <DialogTitle>
            <Typography variant="div">Food Items</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid open container spacing={2} mt={1}>
              {foods?.map((food) => (
                <Grid item xs={3} key={food._id}>
                  <Paper sx={{ p: 2 }}>
                    <img
                      src={`http://localhost:8080/${food.image}`}
                      alt={food.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="subtitle1">{food.name}</Typography>
                    <Typography variant="body2">{food.category}</Typography>
                    <Typography variant="body2">₹{food.price}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowitem(false)} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Orders Table */}
      {showOrders && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={showOrders}
          onClose={() => setShowOrders(false)}
        >
          <DialogTitle>Orders</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead component={Paper} elevation={3} sx={{ textAlign: "center" }}>
                  <TableRow sx={{ textAlign: "center" }}>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      USER
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      FOOD
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      QUANTITY
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      TOTAL_AMOUNT
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      STATUS
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "Blue" }}>
                      UPDATE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsperpage, page * rowsperpage + rowsperpage)

                    .map((order) => (
                      <TableRow key={order._id} sx={{ textAlign: "center" }}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {order.UserId?.name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {order.items.map((i) => (
                            <li key={i.foodId?._id}>
                              {i.foodId?.name} ({i.foodId?.price})
                            </li>
                          ))}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {order.items.map((i) => (
                            <div key={i.foodId?._id || "-"}>
                              {i.Quantity || "-"}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {order.totalAmount || "-"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Box
                            component="span"
                            sx={{
                              p: 1,
                              borderRadius: 2, // rounded background
                              color:
                                order.status === "Delivered"
                                  ? "green"
                                  : order.status === "pending"
                                  ? "red"
                                  : "blue",
                              backgroundColor:
                                order.status === "Delivered"
                                  ? "lightgreen"
                                  : order.status === "pending"
                                  ? "#ffcccc" // light red
                                  : "lightblue",

                              display: "inline-block",
                            }}
                          >
                            {order.status}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}>
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Preparing">Preparing</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={orders.length}
              page={page}
              rowsPerPageOptions={[]}
              rowsPerPage={rowsperpage}
              onPageChange={(_, newPage) => setPage(newPage)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowOrders(false)}
              variant="contained"
              color="error"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdminDashboard;
