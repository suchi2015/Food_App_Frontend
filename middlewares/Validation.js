const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const Secret = process.env.Secret_key;

const TokenValidation = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const user = jwt.verify(token, Secret);
    // req.user=user;
    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Invalid Token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can perform this action" });
  }
  next();
};

const isClient = (req, res, next) => {
  if (req.user.role !== "client") {
    return res
      .status(403)
      .json({ message: "Only Client can perform this action" });
  }
  next();
};

const isVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res
      .status(403)
      .json({ message: "Only vendor can perform this action" });
  }
  next();
};

const isDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res
      .status(403)
      .json({ message: "Only driver can perform this action" });
  }
  next();
};

module.exports = { TokenValidation, isAdmin, isClient, isVendor, isDriver };
