import mongoose, { Document } from "mongoose";

export enum RequestType {
  TRANSPORT = "TRANSPORT",
  HIRE_DRIVER = "HIRE_DRIVER",
  INSPECTION = "INSPECTION",
}

export enum RequestStatus {
  PENDING_ADMIN_QUOTE = "PENDING_ADMIN_QUOTE",
  CUSTOMER_REVIEWING_QUOTE = "CUSTOMER_REVIEWING_QUOTE",
  REJECTED_BY_CUSTOMER = "REJECTED_BY_CUSTOMER",
  OPEN_FOR_DRIVERS = "OPEN_FOR_DRIVERS",
  ADMIN_REVIEWING_DRIVERS = "ADMIN_REVIEWING_DRIVERS",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type IAdminQuote = {
  amount: number;
  driverPrice?: number;
  message: string;
  createdAt: Date;
};

export type IExpense = {
  type: string;
  amount: number;
  proofUrl?: string;
  driverNote?: string;
  adminNote?: string;
  uploadedBy: "Admin" | "Driver";
  createdAt: Date;
};

export type IDriverQuote = {
  driverId: mongoose.Schema.Types.ObjectId;
  amount: number;
  servicePrice?: number;
  fuelCost?: number;
  tollCharges?: number;
  travelCost?: number;
  taxiCost?: number;
  message?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
};

export type IRequest = Document & {
  _id: mongoose.Schema.Types.ObjectId;
  missionId: string;
  customerId: mongoose.Schema.Types.ObjectId;
  type: RequestType;
  status: RequestStatus;
  details: Record<string, any>;
  adminQuote?: IAdminQuote;
  driverQuotes: IDriverQuote[];
  expenses: IExpense[];
  assignedDriverId?: mongoose.Schema.Types.ObjectId;
  assignedDriverIds?: mongoose.Schema.Types.ObjectId[];
  invoiceUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
