import mongoose, { Document, Schema, Model } from "mongoose";
import { ICustomers } from "./customers.interface";



const CustomersSchema = new Schema<ICustomers>(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Auth",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: null,
    },
    phone_number: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    date_of_birth: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "deactivate"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Customers: Model<ICustomers> = mongoose.model<ICustomers>("Customers", CustomersSchema);

export default Customers;
