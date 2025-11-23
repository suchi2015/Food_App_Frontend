import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios"; 

const AdminAuth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
     setErrors([]); 
  };

  const handleSubmit = async () => {
   
    try {
       setErrors([]); 
      if (isRegister) {
        // Register admin
        const res = await axios.post("http://localhost:5000/admin/register", form);
       toast.success (res.data?.message || "Admin registered successfully! Please login.");
        setIsRegister(false);
        setForm({ name: "", email: "", password: "" });
      } else {
        // Login admin
        const res = await axios.post("http://localhost:5000/admin/login", form);
        localStorage.setItem("token", res.data.token);
        toast.success(res.data?.message || "Login successful!");
        onLogin(); // switch to student page
      }
    }  catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // Display Joi validation errors
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(["Something went wrong"]);
      }
    } 
  };

  return (
    <Paper sx={{ maxWidth: 400, margin: "auto", mt: 10, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isRegister ? "Admin Register" : "Admin Login"}
      </Typography>
      {errors.length>0 && (
        <Box sx={{mb:2}}>
          {errors.map((err,index)=>(
            
            <Typography key={index} color='error' variant='body2'>
              {err}
            </Typography>
          ))}

      </Box>
    )}

      {isRegister && (
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        // disabled={loading}
      >
        { isRegister ? "Register" : "Login"}
      </Button>

      <Button
        sx={{ mt: 2 }}
        fullWidth
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "New admin? Register"}
      </Button>
    </Paper>
  );
};

export default AdminAuth;
