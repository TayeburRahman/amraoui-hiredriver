import mongoose, { Document } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: number[]; // [longitude, latitude]
}

export interface IDrivers extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  authId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  profile_image?: string | null;
  license_number?: string | null;
  vehicle_type?: string | null;
  vehicle_plate?: string | null;
  location?: ILocation;
  totalDeliveries: number;
  rating?: number;
  status: 'pending' | 'approved' | 'declined';
  createdAt?: Date;
  updatedAt?: Date;
}