import jwt from "jsonwebtoken";
import express from "express";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("Please provide token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Error("unauthorized");
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    throw new Error(error?.message);
  }
};
