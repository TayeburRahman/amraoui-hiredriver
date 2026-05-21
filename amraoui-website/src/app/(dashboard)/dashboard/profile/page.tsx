'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Globe, 
  Camera, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  HelpCircle,
  FileText,
  LogOut
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppSelector } from '@/hooks/redux';
import { toast } from 'sonner';

// Custom Toggle Switch Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-white ${checked ? 'bg-brand-blue' : 'bg-slate-200'}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// --- Tab Components ---

const ProfileTab = ({ t, user }: { t: any; user: any }) => (
  <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
    <h3 className="text-xl font-bold text-brand-text">{t.settings?.personalInfo || 'Personal Information'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.fullName || 'Full Name'}</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input defaultValue={user?.name || "Amraoui"} className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.emailAddress || 'Email Address'}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input defaultValue={user?.email || "amraoui@email.com"} className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.phoneNumber || 'Phone Number'}</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input defaultValue="+33 6 12 34 56 78" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.companyName || 'Company Name'}</label>
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input defaultValue="Hiflow Transport Co." className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.address || 'Address'}</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input defaultValue="123 Rue de Rivoli, Paris, France" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
    </div>
    <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 mt-6">
      <Button variant="outline" className="rounded-xl font-bold h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
        {t.settings?.cancel || 'Cancel'}
      </Button>
      <Button onClick={() => toast.success('Profile updated successfully')} className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100">
        {t.settings?.saveChanges || 'Save Changes'}
      </Button>
    </div>
  </Card>
);

const SecurityTab = ({ t }: { t: any }) => (
  <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
    <h3 className="text-xl font-bold text-brand-text">{t.settings?.securitySettings || 'Security Settings'}</h3>
    <div className="space-y-6">
      <div className="space-y-2 max-w-lg">
        <label className="text-xs font-bold text-brand-text">{t.settings?.currentPassword || 'Current Password'}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input type="password" placeholder="Enter current password" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2 max-w-lg">
        <label className="text-xs font-bold text-brand-text">{t.settings?.newPassword || 'New Password'}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input type="password" placeholder="Enter new password" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
      <div className="space-y-2 max-w-lg">
        <label className="text-xs font-bold text-brand-text">{t.settings?.confirmNewPassword || 'Confirm New Password'}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input type="password" placeholder="Confirm new password" className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-brand-blue font-medium" />
        </div>
      </div>
    </div>
    <div className="flex justify-end pt-6 border-t border-slate-50 mt-6">
      <Button className="rounded-xl font-bold h-11 px-6 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100">
        {t.settings?.updatePassword || 'Update Password'}
      </Button>
    </div>
  </Card>
);

const PaymentTab = ({ t }: { t: any }) => (
  <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.paymentMethods || 'Payment Methods'}</h3>
      <Button className="rounded-xl font-bold h-10 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-md shadow-blue-100">
        {t.settings?.addCard || '+ Add Card'}
      </Button>
    </div>
    
    <div className="space-y-4">
      <div className="p-4 sm:p-5 rounded-2xl border border-brand-blue/30 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
            <CreditCard className="h-6 w-6 text-brand-blue" />
          </div>
          <div>
            <p className="font-bold text-brand-text">Visa ending 4242</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{t.settings?.expires || 'Expires'} 08/28</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-brand-blue text-white hover:bg-brand-blue px-3 py-1 rounded-full text-[10px] font-bold border-none uppercase tracking-wider">
            {t.settings?.default || 'Default'}
          </Badge>
          <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
            {t.settings?.remove || 'Remove'}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
            <CreditCard className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-brand-text">Mastercard ending 8891</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{t.settings?.expires || 'Expires'} 12/27</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors">
            {t.settings?.setDefault || 'Set Default'}
          </button>
          <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
            {t.settings?.remove || 'Remove'}
          </button>
        </div>
      </div>
    </div>
  </Card>
);

const NotificationsTab = ({ t }: { t: any }) => {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [deliveryReminders, setDeliveryReminders] = useState(false);
  const [promoOffers, setPromoOffers] = useState(false);

  return (
    <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
      <h3 className="text-xl font-bold text-brand-text">{t.settings?.notificationPreferences || 'Notification Preferences'}</h3>
      <div className="space-y-4">
        {[
          { id: 'orderUpdates', label: t.settings?.orderUpdates || 'Order updates', desc: t.settings?.orderUpdatesDesc || 'Notifications about order status changes', state: orderUpdates, setter: setOrderUpdates },
          { id: 'emailNotifs', label: t.settings?.emailNotifs || 'Email notifications', desc: t.settings?.emailNotifsDesc || 'Receive updates via email', state: emailNotifs, setter: setEmailNotifs },
          { id: 'smsNotifs', label: t.settings?.smsNotifs || 'SMS notifications', desc: t.settings?.smsNotifsDesc || 'Receive updates via SMS', state: smsNotifs, setter: setSmsNotifs },
          { id: 'deliveryReminders', label: t.settings?.deliveryReminders || 'Delivery reminders', desc: t.settings?.deliveryRemindersDesc || 'Get reminded about upcoming deliveries', state: deliveryReminders, setter: setDeliveryReminders },
          { id: 'promoOffers', label: t.settings?.promoOffers || 'Promotional offers', desc: t.settings?.promoOffersDesc || 'Receive special offers and discounts', state: promoOffers, setter: setPromoOffers },
        ].map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="pr-4">
              <p className="font-bold text-brand-text">{item.label}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <Toggle checked={item.state} onChange={() => item.setter(!item.state)} />
          </div>
        ))}
      </div>
    </Card>
  );
};

const PreferencesTab = ({ t }: { t: any }) => (
  <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
    <h3 className="text-xl font-bold text-brand-text">{t.settings?.preferences || 'Preferences'}</h3>
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.language || 'Language'}</label>
        <select className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium text-brand-text appearance-none cursor-pointer">
          <option value="en">English (US)</option>
          <option value="fr">Français</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-brand-text">{t.settings?.currency || 'Currency'}</label>
        <select className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-brand-blue font-medium text-brand-text appearance-none cursor-pointer">
          <option value="eur">Euro (€)</option>
          <option value="usd">US Dollar ($)</option>
          <option value="gbp">British Pound (£)</option>
        </select>
      </div>
    </div>
  </Card>
);

// --- Main Profile Page Component ---

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: t.settings?.profile || 'Profile', icon: User },
    { id: 'security', label: t.settings?.security || 'Security', icon: Lock },
    { id: 'payment', label: t.settings?.paymentMethods || 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: t.settings?.notifications || 'Notifications', icon: Bell },
    { id: 'preferences', label: t.settings?.preferences || 'Preferences', icon: Globe },
  ];

  return (
    <div className="max-w-[1000px] mx-auto min-h-screen pb-12 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text">Profile & Settings</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Manage your account information and preferences.</p>
      </div>

      {/* Top Cover Card */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-brand-blue to-cyan-400 w-full" />
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4 sm:mb-0">
            <div className="relative inline-block">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-brand-blue text-white flex items-center justify-center text-3xl sm:text-4xl font-black shadow-md">
                {user?.name?.substring(0, 2).toUpperCase() || 'AM'}
              </div>
              <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-8 w-8 rounded-full bg-white text-brand-blue shadow-md flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 sm:mt-0 sm:mb-2 w-full sm:w-auto">
              <Button 
                onClick={() => {
                  setActiveTab('profile');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }} 
                variant="outline" 
                className="w-full sm:w-auto rounded-2xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors h-10 px-6"
              >
                {t.settings?.editProfile || 'Edit Profile'}
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-text">{user?.name || 'Amraoui'}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{user?.email || 'amraoui@email.com'}</p>
            <div className="flex items-center gap-2 mt-4">
              <Badge className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold border-none">
                {t.settings?.premiumMember || 'Premium Member'}
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border-none">
                {t.settings?.verified || 'Verified'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-2 flex overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[140px] h-12 rounded-2xl font-bold flex items-center justify-center transition-colors text-sm whitespace-nowrap px-4
              ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'profile' && <ProfileTab t={t} user={user} />}
        {activeTab === 'security' && <SecurityTab t={t} />}
        {activeTab === 'payment' && <PaymentTab t={t} />}
        {activeTab === 'notifications' && <NotificationsTab t={t} />}
        {activeTab === 'preferences' && <PreferencesTab t={t} />}
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
        <Card className="p-5 sm:p-6 rounded-[2rem] border border-red-200 shadow-sm bg-white hover:bg-red-50 cursor-pointer transition-colors group">
          <LogOut className="h-6 w-6 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-red-600 mb-1">{t.settings?.logout || 'Logout'}</h4>
          <p className="text-xs font-medium text-slate-500">{t.settings?.logoutDesc || 'Sign out of your account'}</p>
        </Card>
      </div>
    </div>
  );
}
