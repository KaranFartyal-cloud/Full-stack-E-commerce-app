import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addProduct,
  addToCart,
  deleteFromCart,
  getProduct,
  getRecentProducts,
  removeFromCart,
  searchByCategory,
  searchProducts,
} from "../controller/product.controller.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router
  .route("/add")
  .post(isAuthenticated, upload.array("photos", 5), addProduct);

router.route("/search").get(searchProducts);
router.route("/product-page/:id").get(getProduct);
router.route("/cart/add").post(isAuthenticated, addToCart);
router.route("/cart/remove").post(isAuthenticated, removeFromCart);
router.route("/cart/delete").post(isAuthenticated, deleteFromCart);
router.route("/").get(searchByCategory);
router.route("/get-recent-products").get(getRecentProducts);

export default router;
