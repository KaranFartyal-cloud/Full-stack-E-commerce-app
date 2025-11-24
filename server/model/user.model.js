import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    ordersToDeliver: [
      {
        amount: { type: Number },
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        shippingAddress: String,
        status: { type: String, default: "pending" },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
