"use server";
import bcrypt from "bcryptjs";
import { connectDB } from "@lib/mongodb";
import User from "@models/User";
import { RegisterPayload } from "@customTypes/index";

export const register = async (values: RegisterPayload) => {
  const { email, password, name } = values;

  try {
    await connectDB();
    // @ts-expect-error ignore
    const userFound = await User.findOne({ email });

    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
  } catch (e) {
    console.log("actions -> register -> error", e);
  }

  return {
    message: "User has been registered successfully.",
  };
};
