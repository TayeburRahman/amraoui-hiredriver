import { Document, Types } from 'mongoose';

export type NotificationType = 'QUOTE_RECEIVED' | 'STATUS_UPDATE' | 'SYSTEM' | 'DRIVER_ASSIGNED' | 'MISSION_ASSIGNED' | 'MISSION_COMPLETED';

export type INotification = Document & {
  recipientId: Types.ObjectId; // The user ID (e.g., customerId or driverId)
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
};
