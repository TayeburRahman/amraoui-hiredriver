import mongoose, { Schema, Model } from 'mongoose';
import { INotification } from './notifications.interface';

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['QUOTE_RECEIVED', 'STATUS_UPDATE', 'SYSTEM', 'DRIVER_ASSIGNED', 'MISSION_ASSIGNED', 'MISSION_COMPLETED'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);
