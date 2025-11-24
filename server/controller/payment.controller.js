import { User } from "../model/user.model.js";
import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { razorpay } from "../config/razorpay.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalAmount = 0;
    let orderProducts = [];

    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${item.product._id} not found` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
      },
    });

    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: shippingAddress,
    });

    await order.save();

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      shippingAddress,
    } = req.body;

    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      const order = await Order.findById(orderId).populate("products.product");

      if (!order) return res.status(404).json({ error: "Order not found" });

      order.paymentStatus = "completed";
      order.paymentId = razorpay_payment_id;
      order.signature = razorpay_signature;
      order.orderStatus = "confirmed";
      await order.save();

      const userId = req.id;

      for (let item of order.products) {
        const sellerId = item.product.sellerId;

        if (!sellerId) return next(new Error("seller missing"));

        const seller = await User.findById(sellerId);

        seller.ordersToDeliver.push({
          amount: item.product.price,
          buyer: userId,
          product: item.product._id,
          quantity: item.quantity,
          shippingAddress: shippingAddress,
        });

        await seller.save();
      }

      await User.findByIdAndUpdate(userId, { cart: [] });

      res.json({
        success: true,
        message: "Payment verified successfully",
        order: order,
      });
    } else {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
      });

      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
};
