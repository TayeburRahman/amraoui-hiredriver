import mongoose, { Document } from "mongoose";

export type ICustomers = Document & {
  _id: mongoose.Schema.Types.ObjectId;
  authId: mongoose.Schema.Types.ObjectId;
  linkedAuthIds?: mongoose.Schema.Types.ObjectId[];
  name: string;
  family_name?: string;
  company?: string;
  tax_number?: string;
  message?: string;
  email: string;
  address: string | null;
  profile_image?: string | null;
  phone_number?: string | null;
  date_of_birth?: Date;
  status: "pending" | "active" | "deactivate";
  notificationPrefs?: {
    orderUpdates: boolean;
    emailNotifs: boolean;
    smsNotifs: boolean;
    deliveryReminders: boolean;
    promoOffers: boolean;
  };
  language?: string;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}