import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createOrder,
  getPaymentDetails,
  verifyPayment,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/payment-details/:paymentId", isAuthenticated, getPaymentDetails);

export default router;
