import mongoose, { Document } from "mongoose";

export type ICustomers = Document & {
  _id: mongoose.Schema.Types.ObjectId;
  authId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  address: string | null;
  profile_image?: string | null;
  phone_number?: string | null;
  date_of_birth?: Date;
  status: "active" | "deactivate";
  createdAt?: Date;
  updatedAt?: Date;
}