import User from "../users/user.model";

interface RegisterUserInput {
  name: string;
  surname: string;
  startUp: string;
  email: string;
  dni: string;
  phone: string;
  password: string;
}

export const registerUser = async (userInput: RegisterUserInput) => {
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
};
