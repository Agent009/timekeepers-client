import mongoose, { Schema, model } from "mongoose";
import { EpochData } from "@customTypes/index";

export interface EpochDocument extends EpochData {
  _id: string; // Include _id for Mongoose document
}

const EpochSchema = new Schema<EpochDocument>(
  {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    isoDate: {
      type: String,
      required: true,
    },
    ymdDate: {
      type: String,
      required: true,
    },
    ymdhmDate: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    nft: {
      type: String,
      default: null,
    },
    rarity: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Epoch = mongoose.models?.Epoch || model<EpochDocument>("Epoch", EpochSchema);
export default Epoch;
