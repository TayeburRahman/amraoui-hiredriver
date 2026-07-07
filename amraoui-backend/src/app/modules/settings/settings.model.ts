import { Schema, model } from 'mongoose';
import { ISettings } from './settings.interface';

const SettingsSchema = new Schema<ISettings>(
  {
    privacyPolicy: {
      type: String,
      default: '',
    },
    termsCondition: {
      type: String,
      default: '',
    },
    supportText: {
      type: String,
      default: 'Need assistance with your bookings, account settings, or have other questions? Get in touch with our team.',
    },
    supportEmail: {
      type: String,
      default: 'support@amraoui.com',
    },
    supportHours: {
      type: String,
      default: 'Mon - Fri, 9:00 - 18:00 CET.',
    },
    supportResponseTime: {
      type: String,
      default: 'Usually under 2 hours',
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = model<ISettings>('Settings', SettingsSchema);
