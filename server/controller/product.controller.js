import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
import { bufferToDataURI } from "../config/bufferToDatauri.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res, next) => {
  try {
    const { name, price, description, category } = req.body;
    const sellerId = req.id;

    if (!name || !price) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const user = await User.findById(sellerId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "admin")
      return res.status(403).json({ error: "You are not an admin" });

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Please upload product photos" });
    }

    const uploadedPhotos = [];

    for (const file of files) {
      const dataUri = await bufferToDataURI(file);

      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: "ecommerce/products",
      });

      uploadedPhotos.push(uploadRes.secure_url);
    }

    const product = await Product.create({
      name,
      price,
      photo: uploadedPhotos,
      description,
      sellerId,
      category,
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;

    const mongoQuery = {};

    if (query) {
      mongoQuery.name = { $regex: query, $options: "i" };
    }

    if (category) {
      mongoQuery.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      mongoQuery.price = {};
      if (minPrice) mongoQuery.price.$gte = Number(minPrice);
      if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(mongoQuery);

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.id;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("couldn't find product");
      error.status = 404;
      throw error;
    }

    const user = await User.findById(userId);

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);

    const product = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!product) {
      throw new Error("product is not present in the cart");
    }

    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== product.product.toString()
      );
    }

    await user.save();

    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);

    const product = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!product) {
      throw new Error("product is not present in the cart");
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== product.product.toString()
    );

    await user.save();

    await user.populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const searchByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category || category.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const products = await Product.find({
      category: { $regex: `^${category}$`, $options: "i" },
    });

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "sellerId",
      select: "_id name email",
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};
