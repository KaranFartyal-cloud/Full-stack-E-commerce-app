import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("Can't find MONGO_URI");
    const db = await mongoose.connect(process.env.MONGO_URI);

    console.log("db connected successfully");
  } catch (error) {
    throw new Error(error?.message);
  }
};
