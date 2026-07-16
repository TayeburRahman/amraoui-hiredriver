import mongoose, { Document } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: number[]; // [longitude, latitude]
}

export interface IDrivers extends Document {
  authId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  profile_image?: string | null;
  license_number?: string | null;
  vehicle_type?: string | null;
  vehicle_plate?: string | null;
  company_name?: string | null;
  tax_number?: string | null;
  vehicle_carrier_image?: string | null;
  dealer_plate_image?: string | null;
  location?: ILocation;
  totalDeliveries: number;
  rating?: number;
  status: 'pending' | 'approved' | 'declined';
  license_document?: string | null;
  license_document_front?: string | null;
  license_document_back?: string | null;
  id_document?: string | null;
  id_document_front?: string | null;
  id_document_back?: string | null;
  contract_document?: string | null;
  documents_submitted?: boolean;
  documents_submitted_at?: Date | null;
  decline_reason?: string | null;
  skills?: { name: string; stars: number }[];
  admin_notes?: string;
  license_status?: 'pending' | 'verified' | 'rejected';
  id_status?: 'pending' | 'verified' | 'rejected';
  contract_status?: 'pending' | 'verified' | 'rejected';
  vehicle_carrier_status?: 'pending' | 'verified' | 'rejected';
  dealer_plate_status?: 'pending' | 'verified' | 'rejected';
  document_activity?: { message: string; by: string; date: Date }[];
  createdAt?: Date;
  updatedAt?: Date;
}