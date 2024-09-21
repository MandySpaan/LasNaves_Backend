import mongoose from "mongoose";
import dotenv from "dotenv";
import { userSeeder } from "./userSeeder";
import { roomSeeder } from "./roomSeeder";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
// The empty string can be set as a fallback value in case the .env is not set

(async () => {
  console.log("Starting seeders...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  await userSeeder();
  await roomSeeder();
  await mongoose.connection.close();
  console.log("Database connection closed");
})();
