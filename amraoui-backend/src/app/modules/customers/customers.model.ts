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
    family_name: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      default: null,
    },
    tax_number: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
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
      enum: ["pending", "active", "deactivate"],
      default: "pending",
    },
    notificationPrefs: {
      orderUpdates: { type: Boolean, default: true },
      emailNotifs: { type: Boolean, default: true },
      smsNotifs: { type: Boolean, default: true },
      deliveryReminders: { type: Boolean, default: false },
      promoOffers: { type: Boolean, default: false },
    },
    language: {
      type: String,
      default: "en",
    },
    currency: {
      type: String,
      default: "usd",
    },
  },
  {
    timestamps: true,
  }
);

const Customers: Model<ICustomers> = mongoose.model<ICustomers>("Customers", CustomersSchema);

export default Customers;
