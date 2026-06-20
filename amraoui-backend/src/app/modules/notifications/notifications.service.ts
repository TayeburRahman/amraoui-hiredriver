import { Notification } from './notifications.model';
import { INotification } from './notifications.interface';
import { Types } from 'mongoose';

const createNotification = async (payload: Partial<INotification>) => {
  const result = await Notification.create(payload);
  return result;
};

const getMyNotifications = async (recipientId: string) => {
  const result = await Notification.find({ recipientId: new Types.ObjectId(recipientId) })
    .sort({ createdAt: -1 })
    .limit(50);
  return result;
};

const markAsRead = async (notificationId: string, recipientId: string) => {
  const result = await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: new Types.ObjectId(recipientId) },
    { isRead: true },
    { new: true }
  );
  return result;
};

const markAllAsRead = async (recipientId: string) => {
  const result = await Notification.updateMany(
    { recipientId: new Types.ObjectId(recipientId), isRead: false },
    { isRead: true }
  );
  return result;
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
