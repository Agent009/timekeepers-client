"use server";
import bcrypt from "bcryptjs";
import { connectDB } from "@lib/mongodb";
import UserModel from "@models/user";
import { RegisterPayload } from "@customTypes/index";

export const register = async (values: RegisterPayload) => {
  const { email, password, name } = values;

  try {
    await connectDB();
    // @ts-expect-error ignore
    const userFound = await UserModel.findOne({ email });

    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
  } catch (e) {
    console.error("actions -> register -> error", e);
  }

  console.log("actions -> register -> success");
  return {
    message: "User has been registered successfully.",
  };
};
