import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB = process.env.APP_DB;
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(`❌ Unable to connect with Database: ${err}`);
    process.exit(1);
  }
};

export default connectDB;

