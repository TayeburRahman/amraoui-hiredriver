'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User, Lock, Bell, Globe, Camera, Mail, Phone,
  HelpCircle, FileText, LogOut, Eye, EyeOff, Loader2,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout, updateUser } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile, changePassword } from '@/lib/auth.api';
import { useRouter } from 'next/navigation';
import { setLanguage } from '@/store/slices/settingsSlice';

// ─── Toggle Switch ─────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${checked ? 'bg-brand-blue' : 'bg-slate-200'}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Base URL for static images (backend serves from root)
const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');
  return `${base}${path}`;
};

// ─── Profile Tab ───────────────────────────────────────────────────
const ProfileTab = ({
  t,
  profile,
  onSaved,
}: {
  t: any;
  profile: any;
  onSaved: (updated: any) => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(profile?.authId?.name || profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const currentImage = profile?.profile_image || profile?.authId?.profile_image;
  const imageUrl = getImageUrl(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (phone) formData.append('phone_number', phone);
      if (file) formData.append('profile_image', file);

      const res = await updateMyProfile(formData);
      onSaved(res.data);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.personalInfo || 'Personal Information'}</h3>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-brand-blue text-white flex items-center justify-center text-2xl font-black shadow-md overflow-hidden">
            {preview || imageUrl ? (
              <img src={preview || imageUrl!} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              (name || profile?.authId?.name || 'U').substring(0, 2).toUpperCase()
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand-blue text-white shadow-md flex items-center justify-center hover:bg-brand-blue-hover transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <div>
          <p className="font-bold text-brand-text">{name || '—'}</p>
          <p className="text-xs font-medium text-slate-400">{profile?.authId?.email || profile?.email || '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">{t.settings?.fullName || 'Full Name'}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">{t.settings?.emailAddress || 'Email Address'}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={profile?.authId?.email || profile?.email || ''}
              readOnly
              className="pl-11 h-12 rounded-xl bg-slate-100 border-slate-200 font-medium text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">{t.settings?.phoneNumber || 'Phone Number'}</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">Account Role</label>
          <div className="relative">
            <Input
              value="Customer"
              readOnly
              className="h-12 rounded-xl bg-slate-100 border-slate-200 font-medium text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 mt-6">
        <Button
          variant="outline"
          className="rounded-xl font-bold h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
          onClick={() => {
            setName(profile?.authId?.name || profile?.name || '');
            setPhone(profile?.phone_number || '');
            setPreview(null);
            setFile(null);
          }}
        >
          {t.settings?.cancel || 'Cancel'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t.settings?.saveChanges || 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
};

// ─── Security Tab ──────────────────────────────────────────────────
const SecurityTab = ({ t }: { t: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.oldPassword) e.oldPassword = 'Current password is required';
    if (form.newPassword.length < 6) e.newPassword = 'Minimum 6 characters';
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await changePassword(form);
      toast.success('Password changed successfully!');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const Field = ({
    label,
    key_,
    showKey,
  }: {
    label: string;
    key_: 'oldPassword' | 'newPassword' | 'confirmPassword';
    showKey: 'old' | 'new' | 'confirm';
  }) => (
    <div className="space-y-2 max-w-lg">
      <label className="text-xs font-bold text-brand-text">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={show[showKey] ? 'text' : 'password'}
          value={form[key_]}
          onChange={(e) => setForm((f) => ({ ...f, [key_]: e.target.value }))}
          placeholder="••••••••"
          className="pl-11 pr-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium"
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {errors[key_] && <p className="text-xs font-medium text-red-500">{errors[key_]}</p>}
    </div>
  );

  return (
    <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.securitySettings || 'Security Settings'}</h3>
      <div className="space-y-6">
        <Field label={t.settings?.currentPassword || 'Current Password'} key_="oldPassword" showKey="old" />
        <Field label={t.settings?.newPassword || 'New Password'} key_="newPassword" showKey="new" />
        <Field label={t.settings?.confirmNewPassword || 'Confirm New Password'} key_="confirmPassword" showKey="confirm" />
      </div>
      <div className="flex justify-end pt-6 border-t border-slate-50 mt-6">
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t.settings?.updatePassword || 'Update Password'}
        </Button>
      </div>
    </Card>
  );
};

// ─── Notifications Tab ─────────────────────────────────────────────
const NotificationsTab = ({ t, prefs, setPrefs, onSave }: { t: any; prefs: any; setPrefs: any; onSave: () => void }) => {
  const toggle = (k: string) => setPrefs((p: any) => ({ ...p, [k]: !p[k] }));

  const items = [
    { id: 'orderUpdates' as const, label: 'Order updates', desc: 'Notifications about order status changes' },
    { id: 'emailNotifs' as const, label: 'Email notifications', desc: 'Receive updates via email' },
    { id: 'smsNotifs' as const, label: 'SMS notifications', desc: 'Receive updates via SMS' },
    { id: 'deliveryReminders' as const, label: 'Delivery reminders', desc: 'Get reminded about upcoming deliveries' },
    { id: 'promoOffers' as const, label: 'Promotional offers', desc: 'Receive special offers and discounts' },
  ];

  return (
    <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.notificationPreferences || 'Notification Preferences'}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="pr-4">
              <p className="font-bold text-brand-text">{item.label}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.id]} onChange={() => toggle(item.id)} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-6 border-t border-slate-50 mt-6">
        <Button
          onClick={onSave}
          className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100"
        >
          {t.settings?.saveChanges || 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
};

// ─── Preferences Tab ───────────────────────────────────────────────
const PreferencesTab = ({ 
  t, 
  language, 
  onLanguageChange,
  currency,
  onCurrencyChange,
  onSave
}: { 
  t: any; 
  language: string; 
  onLanguageChange: (l: string) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onSave: () => void;
}) => {
  return (
    <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.preferences || 'Preferences'}</h3>
      <div className="space-y-6 max-w-lg">
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">{t.settings?.language || 'Language'}</label>
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium text-brand-text appearance-none cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="fr">Français</option>
            <option value="nl">Nederlands</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-text">{t.settings?.currency || 'Currency'}</label>
          <select 
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium text-brand-text appearance-none cursor-pointer"
          >
            <option value="usd">US Dollar ($)</option>
            <option value="eur">Euro (€)</option>
            <option value="gbp">British Pound (£)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-6 border-t border-slate-50 mt-6">
        <Button
          onClick={onSave}
          className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100"
        >
          {t.settings?.saveChanges || 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
};

// ─── Main Profile Page ─────────────────────────────────────────────
export default function ProfilePage() {
  const { t, language } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Lifted state to persist across tab changes
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    emailNotifs: true,
    smsNotifs: true,
    deliveryReminders: false,
    promoOffers: false,
  });
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
        if (res.data?.notificationPrefs) {
          setNotificationPrefs(res.data.notificationPrefs);
        }
        if (res.data?.currency) {
          setCurrency(res.data.currency);
        }
        if (res.data?.language) {
          dispatch(setLanguage(res.data.language as any));
        }
      } catch (err) {
        toast.error('Failed to load profile data.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleSaveSettings = async (type: 'notifications' | 'preferences') => {
    try {
      const formData = new FormData();
      if (type === 'notifications') {
        formData.append('notificationPrefs', JSON.stringify(notificationPrefs));
      } else {
        formData.append('currency', currency);
        formData.append('language', language);
      }
      
      const res = await updateMyProfile(formData);
      handleProfileSaved(res.data);
      toast.success(type === 'notifications' ? 'Notification preferences updated!' : 'Preferences updated successfully!');
    } catch (err) {
      toast.error('Failed to save settings.');
    }
  };

  const handleProfileSaved = (updatedData: any) => {
    setProfile(updatedData);
    dispatch(updateUser(updatedData));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    toast.success('You have been logged out.');
  };

  const displayName = profile?.authId?.name || profile?.name || user?.name || 'Customer';
  const displayEmail = profile?.authId?.email || profile?.email || user?.email || '—';
  const profileImage = profile?.profile_image || profile?.authId?.profile_image;
  const imageUrl = getImageUrl(profileImage);

  const tabs = [
    { id: 'profile', label: t.settings?.profile || 'Profile', icon: User },
    { id: 'security', label: t.settings?.security || 'Security', icon: Lock },
    { id: 'notifications', label: t.settings?.notifications || 'Notifications', icon: Bell },
    { id: 'preferences', label: t.settings?.preferences || 'Preferences', icon: Globe },
  ];

  return (
    <div className="max-w-[1000px] mx-auto min-h-screen pb-12 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text">Profile &amp; Settings</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Manage your account information and preferences.</p>
      </div>

      {/* Cover Card */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-brand-blue to-cyan-400 w-full" />
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4 sm:mb-0">
            <div className="relative inline-block">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-brand-blue text-white flex items-center justify-center text-3xl sm:text-4xl font-black shadow-md overflow-hidden">
                {isFetching ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : imageUrl ? (
                  <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  displayName.substring(0, 2).toUpperCase()
                )}
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-8 w-8 rounded-full bg-white text-brand-blue shadow-md flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 sm:mt-0 sm:mb-2 w-full sm:w-auto">
              <Button
                onClick={() => setActiveTab('profile')}
                variant="outline"
                className="w-full sm:w-auto rounded-2xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors h-10 px-6"
              >
                {t.settings?.editProfile || 'Edit Profile'}
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-text">{displayName}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{displayEmail}</p>
            <div className="flex items-center gap-2 mt-4">
              <Badge className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold border-none">
                Customer
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border-none">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-2 flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[130px] h-12 rounded-2xl font-bold flex items-center justify-center transition-colors text-sm whitespace-nowrap px-4
              ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {isFetching ? (
          <Card className="p-12 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </Card>
        ) : (
          <>
            {activeTab === 'profile' && (
              <ProfileTab t={t} profile={profile} onSaved={handleProfileSaved} />
            )}
            {activeTab === 'security' && <SecurityTab t={t} />}
            {activeTab === 'notifications' && (
              <NotificationsTab 
                t={t} 
                prefs={notificationPrefs} 
                setPrefs={setNotificationPrefs} 
                onSave={() => handleSaveSettings('notifications')} 
              />
            )}
            {activeTab === 'preferences' && (
              <PreferencesTab 
                t={t} 
                language={language} 
                onLanguageChange={(l) => dispatch(setLanguage(l as any))} 
                currency={currency}
                onCurrencyChange={setCurrency}
                onSave={() => handleSaveSettings('preferences')}
              />
            )}
          </>
        )}
      </div>

      {/* Footer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
        <Card className="p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm bg-white hover:border-brand-blue/30 cursor-pointer transition-colors group">
          <HelpCircle className="h-6 w-6 text-brand-blue mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-brand-text mb-1">{t.settings?.helpSupport || 'Help & Support'}</h4>
          <p className="text-xs font-medium text-slate-500">{t.settings?.helpSupportDesc || 'Get help with your account'}</p>
        </Card>
        <Card className="p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm bg-white hover:border-brand-blue/30 cursor-pointer transition-colors group">
          <FileText className="h-6 w-6 text-brand-blue mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-brand-text mb-1">{t.settings?.privacyTerms || 'Privacy & Terms'}</h4>
          <p className="text-xs font-medium text-slate-500">{t.settings?.privacyTermsDesc || 'Review our policies'}</p>
        </Card>
        <Card
          onClick={handleLogout}
          className="p-5 sm:p-6 rounded-[2rem] border border-red-100 shadow-sm bg-white hover:bg-red-50 cursor-pointer transition-colors group"
        >
          <LogOut className="h-6 w-6 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-red-600 mb-1">{t.settings?.logout || 'Logout'}</h4>
          <p className="text-xs font-medium text-slate-500">{t.settings?.logoutDesc || 'Sign out of your account'}</p>
        </Card>
      </div>
    </div>
  );
}
