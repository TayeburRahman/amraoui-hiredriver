import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { SettingsService } from './settings.service';
import catchAsync from '../../../shared/catchasync';

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getSettings();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Settings retrieved successfully',
    data: result,
  });
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.updateSettings(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Settings updated successfully',
    data: result,
  });
});

export const SettingsController = {
  getSettings,
  updateSettings,
};
