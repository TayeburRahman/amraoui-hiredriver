import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { NotificationService } from './notifications.service';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipientId = user.authId; // Use authId as notifications are created with authId

  const result = await NotificationService.getMyNotifications(recipientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const recipientId = user.authId; // Use authId as notifications are created with authId

  const result = await NotificationService.markAsRead(id, recipientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read successfully',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipientId = user.authId; // Use authId as notifications are created with authId

  const result = await NotificationService.markAllAsRead(recipientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read successfully',
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
