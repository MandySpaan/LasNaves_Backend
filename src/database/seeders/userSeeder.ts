import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../entities/users/user.model";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
// The empty string can be set as a fallback value in case the .env is not set

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashPassword = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    const users = [];

    for (let i = 1; i <= 2; i++) {
      users.push({
        name: `SuperAdmin${i}`,
        surname: `SuperSurname${i}`,
        email: `superadmin${i}@example.com`,
        dni: `superadminDNI${i}`,
        password: await hashPassword("SuperAdminPassword123"),
        role: "superAdmin",
        isActive: true,
      });
    }

    for (let i = 1; i <= 3; i++) {
      users.push({
        name: `Admin${i}`,
        surname: `AdminSurname${i}`,
        email: `admin${i}@example.com`,
        dni: `adminDNI${i}`,
        password: await hashPassword("AdminPassword123"),
        role: "admin",
        isActive: true,
      });
    }

    for (let i = 1; i <= 45; i++) {
      users.push({
        name: `User${i}`,
        surname: `UserSurname${i}`,
        email: `user${i}@example.com`,
        dni: `userDNI${i}`,
        password: await hashPassword("UserPassword123"),
        role: "user",
        isActive: true,
      });
    }

    await User.insertMany(users);
    console.log("Seed users successfully inserted");

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

seedUsers();
