import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import "../../Styles/Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
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
        const res = await axios.post(
          "http://localhost:8080/admin/register",
          form
        );
        toast.success(
          res.data?.message || "Registered successfully, Login to your account"
        );
        setIsRegister(false);
        setForm({ name: "", email: "", password: "" });
      } else {
        const res = await axios.post("http://localhost:8080/app/login", form);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("id",res.data.user._id)
        const role = localStorage.getItem("role")
        if(role==="admin"){
          return navigate ("/admin")
        }
        toast.success(res.data?.message || "Login successful!");
        navigate("/Fooditems"); 
      
      }
    } catch (err) {
      console.error(err);
     if(err.response?.status===404){
      toast.error("Email not found")
     }else if(err.response?.status===401){
      toast.error("Wrong Password")
     }else(
      toast.error(err.response.data?.message || "something went wrong")
     )
    }
  };

  return (
    <div className="total">
      {/* Left side - Form */}
      <div className="page">
        <Box id="upper">
          <Typography variant="h6">Log in</Typography>
          <p>Please sign in to your existing account</p>
        </Box>
        <Box>
          <Paper sx={{ maxWidth: 400, margin: "auto", mt: 10, p: 3 }}>
            <Typography sx={{ marginBottom: "5px" }} variant="h5">
              {isRegister ? "Register Page" : "Login Page"}
            </Typography>
            {errors.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {errors.map((err, index) => (
                  <Typography key={index} color="error" variant="body2">
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
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={handleSubmit}>
              {isRegister ? "Register" : "Login"}
            </Button>
            <Button
              sx={{ mt: 2 }}
              fullWidth
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? "Already have an account? Login"
                : "New User? Register"}
            </Button>
          </Paper>
        </Box>
      </div>

      {/* Right side - Image */}
      <div className="image-side">
        <img
          src="/images/Background.jpeg"
          alt="Background"
          className="bg-image"
        />
      </div>
    </div>
  );
};

export default Signup;
