import express from "express";
import {
  getOrders,
  login,
  logout,
  register,
  upgradeUser,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/upgrade").post(isAuthenticated, upgradeUser);
router.route("/seller/orders-to-deliver").get(isAuthenticated, getOrders);

export default router;
