import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/lib/translations';

interface SettingsState {
  language: Language;
}

const initialState: SettingsState = {
  language: (typeof window !== 'undefined' && localStorage.getItem('language') as Language) || 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
  },
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
