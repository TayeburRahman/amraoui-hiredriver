import { Settings } from './settings.model';
import { ISettings } from './settings.interface';

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

const updateSettings = async (payload: Partial<ISettings>) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  
  Object.assign(settings, payload);
  await settings.save();
  return settings;
};

export const SettingsService = {
  getSettings,
  updateSettings,
};
