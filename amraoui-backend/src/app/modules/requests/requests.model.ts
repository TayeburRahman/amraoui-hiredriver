import mongoose, { Schema, Model } from "mongoose";
import { IRequest, RequestType, RequestStatus } from "./requests.interface";

const AdminQuoteSchema = new Schema(
  {
    amount: { type: Number, required: true },
    driverPrice: { type: Number },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DriverQuoteSchema = new Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Drivers", required: true },
    amount: { type: Number, required: true },
    servicePrice: { type: Number, default: 0 },
    fuelCost: { type: Number, default: 0 },
    tollCharges: { type: Number, default: 0 },
    travelCost: { type: Number, default: 0 },
    taxiCost: { type: Number, default: 0 },
    message: { type: String, required: false },
    pickupDate: { type: String },
    pickupTime: { type: String },
    dropoffDate: { type: String },
    dropoffTime: { type: String },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ExpenseSchema = new Schema(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    proofUrl: { type: String },
    driverNote: { type: String },
    adminNote: { type: String },
    uploadedBy: { type: String, enum: ["Admin", "Driver"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const RequestsSchema = new Schema<IRequest>(
  {
    missionId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Make false for now to allow anonymous requests, or true if auth is required
      ref: "Customers",
    },
    type: {
      type: String,
      enum: Object.values(RequestType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING_ADMIN_QUOTE,
    },
    details: {
      type: Schema.Types.Mixed,
      required: true,
    },
    adminQuote: {
      type: AdminQuoteSchema,
      default: undefined,
    },
    driverQuotes: {
      type: [DriverQuoteSchema],
      default: [],
    },
    expenses: {
      type: [ExpenseSchema],
      default: [],
    },
    assignedDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      default: null,
    },
    assignedDriverIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drivers" }],
      default: [],
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Requests: Model<IRequest> = mongoose.model<IRequest>("Requests", RequestsSchema);

export default Requests;
