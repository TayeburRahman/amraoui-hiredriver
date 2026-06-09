import mongoose, { Schema, Model } from 'mongoose';
import { IDrivers, ILocation } from './drivers.interface';

const locationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const DriversSchema = new Schema<IDrivers>(
  {
    authId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Auth',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    profile_image: {
      type: String,
      default: null,
    },
    license_number: {
      type: String,
      default: null,
    },
    vehicle_type: {
      type: String,
      default: null,
    },
    vehicle_plate: {
      type: String,
      default: null,
    },
    location: {
      type: locationSchema,
      default: null,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    license_document: {
      type: String,
      default: null,
    },
    id_document: {
      type: String,
      default: null,
    },
    contract_document: {
      type: String,
      default: null,
    },
    documents_submitted: {
      type: Boolean,
      default: false,
    },
    documents_submitted_at: {
      type: Date,
      default: null,
    },
    decline_reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Geo-index for location-based queries
DriversSchema.index({ location: '2dsphere' });

const Drivers: Model<IDrivers> = mongoose.model<IDrivers>('Drivers', DriversSchema);

export default Drivers;
