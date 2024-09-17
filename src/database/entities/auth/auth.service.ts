import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

interface RegisterUserInput {
  name: string;
  surname: string;
  startUp: string;
  email: string;
  dni: string;
  phone: string;
  password: string;
}

class AuthService {
  async registerUser(userInput: RegisterUserInput) {
    const { name, surname, startUp, email, dni, phone, password } = userInput;

    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      throw new Error("User with this email or DNI already exists.");
    }

    const newUser = new User({
      name,
      surname,
      startUp,
      email,
      dni,
      phone,
      password,
    });

    const savedUser = await newUser.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      return token;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
}

export default new AuthService();
