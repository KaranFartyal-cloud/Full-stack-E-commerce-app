import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Product } from "../model/product.model.js";
import { model } from "mongoose";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please provide all the credentials",
    });
  }
  try {
    let user = await User.findOne({ email }).populate("cart.product");

    if (!user) {
      return res.status(401).json({
        sucess: false,
        message: "Invalid Email",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      cart: user.cart,
      role: user.role,
    };

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "user logged in successfully",
        user,
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "please provide all the details",
    });
  }

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        success: true,
        message: "log out successfully",
      });
  } catch (error) {}
};

export const upgradeUser = async (req, res) => {
  const id = req.id;

  try {
    let user = await User.findById({ _id: id }).select("name email cart role");
    if (!user) {
      throw new Error("User is not authorized");
    }

    user.role = "admin";
    user.save();

    return res.status(200).json({
      success: true,
      message: "User is now a admin",
    });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
      path: "ordersToDeliver",
      populate: [
        { path: "product", model: "Product" , select: "name price photo"},
        { path: "buyer", model: "User", select: "name email " },
      ],
    });

    return res.status(200).json({
      success: true,
      orders: user.ordersToDeliver,
    });
  } catch (error) {
    next(error);
  }
};
