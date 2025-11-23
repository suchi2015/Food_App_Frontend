import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FoodItems from "./Components/food/Food_item";
import Signup from "./Components/food/Signup";
import MyOrders from "./Components/food/MyOrders";
import AdminDashboard from "./Components/food/addfood";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in → redirect to signup/login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Role-based access control
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Login/Signup */}
          <Route path="/" element={<Signup />} />

          {/* Client routes */}
          <Route
            path="/fooditems"
            element={
              <PrivateRoute requiredRole="client">
                <FoodItems />
              </PrivateRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <PrivateRoute requiredRole="client">
                <MyOrders />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000} // closes after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default App;
