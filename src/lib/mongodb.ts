import mongoose from "mongoose";
import { constants } from "@lib/constants";

const options = { appName: constants.app.name };
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(constants.db.mongodbUri as string, options);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }

    return Promise.reject("Error connecting to MongoDB");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
