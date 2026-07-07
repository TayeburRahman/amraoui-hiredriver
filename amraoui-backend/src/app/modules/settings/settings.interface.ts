import { Document } from 'mongoose';

export type ISettings = Document & {
  privacyPolicy: string;
  termsCondition: string;
  supportText: string;
  supportEmail: string;
  supportHours: string;
  supportResponseTime: string;
};
