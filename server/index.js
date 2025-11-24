import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnect.js";
import { errorHandler } from "./middlewares/error.handler.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.routes.js";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log("listening to port ", port);
});
