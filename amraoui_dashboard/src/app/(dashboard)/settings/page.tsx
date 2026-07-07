"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Globe, CreditCard, Save, HelpCircle, 
  FileLock, FileText, Users, Bold, Italic, Underline, List, 
  AlignLeft, AlignCenter, AlignRight, ChevronDown, ChevronUp, 
  Plus, Edit2, Trash2, Eye, EyeOff, Upload, Search, X, Key, Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  changePassword,
  createAdmin,
  getAdmins,
  getMyProfile,
  toggleBlockAdmin,
  updateMyProfile,
  updateStoredSession,
} from '@/lib/auth.api';
import { getProfileImageUrl, apiFetch } from '@/lib/api';
import { extractRoleFromUser, getSession } from '@/lib/auth';

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("ADMIN");
  
  // Loading & Alert States
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // FAQ mock database in localStorage
  const [faqs, setFaqs] = useState<{ id: number; q: string; a: string }[]>([]);
  const [isAddFaqModalOpen, setIsAddFaqModalOpen] = useState(false);
  const [isEditFaqModalOpen, setIsEditFaqModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  const [privacyContent, setPrivacyContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  
  // Support state
  const [supportText, setSupportText] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportHours, setSupportHours] = useState("");
  const [supportResponseTime, setSupportResponseTime] = useState("");

  // Admin Management States
  const [admins, setAdmins] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isViewAdminModalOpen, setIsViewAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Add Admin Form States
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Load Initial Data
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    const session = getSession();
    if (session?.role) {
      setCurrentUserRole(session.role);
    }

    loadProfile();
    if (session?.role === "SUPER_ADMIN") {
      loadAdmins();
    }

    // Load FAQs and Content from LocalStorage
    const localFaqs = localStorage.getItem("amraoui_faqs");
    if (localFaqs) {
      setFaqs(JSON.parse(localFaqs));
    } else {
      const initialFaqs = [
        { id: 1, q: "How do I create a new mission?", a: "To create a new mission, go to the Quote Desk page and click on 'New Request' or accept a pending quotation." },
        { id: 2, q: "What documents are required for drivers?", a: "Drivers must provide a valid driver's license, ID document, and a signed contract." },
        { id: 3, q: "How can I track active missions?", a: "You can track active missions on the Mission Monitoring page, which shows real-time status and timeline." },
      ];
      setFaqs(initialFaqs);
      localStorage.setItem("amraoui_faqs", JSON.stringify(initialFaqs));
    }

    const fetchSettings = async () => {
      try {
        const res = await apiFetch<any>('/settings');
        if (res.ok && res.data?.success) {
          const s = res.data.data;
          if (s) {
            setPrivacyContent(s.privacyPolicy || "");
            setTermsContent(s.termsCondition || "");
            setSupportText(s.supportText || "Need assistance with your bookings, account settings, or have other questions? Get in touch with our team.");
            setSupportEmail(s.supportEmail || "support@amraoui.com");
            setSupportHours(s.supportHours || "Mon - Fri, 9:00 - 18:00 CET.");
            setSupportResponseTime(s.supportResponseTime || "Usually under 2 hours");
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, [router]);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await getMyProfile();
      const role = extractRoleFromUser(profile);
      if (role) {
        setCurrentUserRole(role);
        updateStoredSession({ role });
      }
      setFullName((profile.name as string) || "");
      setEmail((profile.email as string) || "");
      setPhoneNumber((profile.phone_number as string) || "");
      setAddress((profile.address as string) || "");
      if (profile.date_of_birth) {
        setDateOfBirth(String(profile.date_of_birth).substring(0, 10));
      }
      setProfileImage(getProfileImageUrl(profile.profile_image as string | null));
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const adminList = await getAdmins();
      setAdmins(adminList);
    } catch (err) {
      console.error("Error fetching admins list:", err);
    }
  };

  // Profile Save
  const handleSaveProfile = async () => {
    if (!token) return;
    setSaveLoading(true);
    setAlertMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("phone_number", phoneNumber);
      formData.append("address", address);
      formData.append("date_of_birth", dateOfBirth);
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const result = await updateMyProfile(formData);
      updateStoredSession({
        name: fullName,
        profile_image: (result?.profile_image as string) || null,
      });

      showAlert('success', "Profile updated successfully!");
      loadProfile();
      setImageFile(null);
    } catch (err: unknown) {
      showAlert('error', err instanceof Error ? err.message : "Network error updating profile.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (newPassword !== confirmPassword) {
      showAlert('error', "New passwords do not match.");
      return;
    }

    setSaveLoading(true);

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmPassword,
      });

      showAlert('success', "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      showAlert('error', err instanceof Error ? err.message : "Network error updating password.");
    } finally {
      setSaveLoading(false);
    }
  };

  // FAQ handlers
  const handleAddFaq = () => {
    if (!faqQuestion || !faqAnswer) return;
    const newFaq = {
      id: Date.now(),
      q: faqQuestion,
      a: faqAnswer
    };
    const updated = [...faqs, newFaq];
    setFaqs(updated);
    localStorage.setItem("amraoui_faqs", JSON.stringify(updated));
    setFaqQuestion("");
    setFaqAnswer("");
    setIsAddFaqModalOpen(false);
    showAlert('success', "FAQ added successfully!");
  };

  const handleEditFaq = () => {
    if (!faqQuestion || !faqAnswer || !selectedFaq) return;
    const updated = faqs.map(f => f.id === selectedFaq.id ? { ...f, q: faqQuestion, a: faqAnswer } : f);
    setFaqs(updated);
    localStorage.setItem("amraoui_faqs", JSON.stringify(updated));
    setFaqQuestion("");
    setFaqAnswer("");
    setIsEditFaqModalOpen(false);
    setSelectedFaq(null);
    showAlert('success', "FAQ updated successfully!");
  };

  const handleDeleteFaq = (id: number) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    localStorage.setItem("amraoui_faqs", JSON.stringify(updated));
    showAlert('success', "FAQ deleted successfully!");
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      const payload = {
        privacyPolicy: privacyContent,
        termsCondition: termsContent,
        supportText,
        supportEmail,
        supportHours,
        supportResponseTime
      };
      const res = await apiFetch<any>('/settings', {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showAlert('success', `Settings updated successfully!`);
      } else {
        showAlert('error', "Failed to update settings");
      }
    } catch (e) {
      showAlert('error', "Network error updating settings");
    } finally {
      setSaveLoading(false);
    }
  };

  // Admin Management handlers
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!adminFirstName || !adminLastName || !adminPhone || !adminEmail || !adminPassword) {
      showAlert('error', "All fields are required.");
      return;
    }

    setSaveLoading(true);

    try {
      await createAdmin({
        name: `${adminFirstName} ${adminLastName}`,
        email: adminEmail,
        password: adminPassword,
        confirmPassword: adminPassword,
        phone_number: adminPhone,
      });

      showAlert('success', "Admin created successfully!");
      setAdminFirstName("");
      setAdminLastName("");
      setAdminPhone("");
      setAdminEmail("");
      setAdminPassword("");
      setIsAddAdminModalOpen(false);
      loadAdmins();
    } catch (err: unknown) {
      showAlert('error', err instanceof Error ? err.message : "Network error creating admin.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleBlockAdmin = async (admin: any) => {
    if (!token) return;
    const isBlocking = !admin.authId?.is_block;

    try {
      await toggleBlockAdmin(admin.email, isBlocking);

      showAlert('success', `Admin ${isBlocking ? 'suspended' : 'activated'} successfully!`);
      setIsViewAdminModalOpen(false);
      loadAdmins();
    } catch (err: unknown) {
      showAlert('error', err instanceof Error ? err.message : "Network error updating admin status.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Filters and search for Admin list
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isBlocked = admin.authId?.is_block;
    if (statusFilter === "Active") return matchesSearch && !isBlocked;
    if (statusFilter === "Suspended") return matchesSearch && isBlocked;
    return matchesSearch;
  });

  const sidebarItems = [
    { name: 'Profile', icon: User },
    { name: 'FAQ', icon: HelpCircle },
    { name: 'Privacy Policy', icon: FileLock },
    { name: 'Terms Condition', icon: FileText },
    { name: 'Help & Support', icon: HelpCircle },
    { name: 'Admin Management', icon: Users },
  ];

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-8 pt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Configure your platform preferences, manage security settings, and update administrative accounts.
        </p>
      </div>

      {alertMessage && (
        <div className={`mb-6 p-4 rounded-xl text-sm border font-medium transition-all ${
          alertMessage.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {alertMessage.type === 'success' ? '✓ ' : '⚠ '}
          {alertMessage.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            
            {/* Tab-based Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{activeTab} Settings</h2>
              {activeTab === 'Profile' && (
                <button 
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm disabled:opacity-75"
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              )}
              {['Privacy Policy', 'Terms Condition', 'Help & Support'].includes(activeTab) && (
                <button 
                  onClick={handleSaveSettings}
                  disabled={saveLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm disabled:opacity-75"
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading settings data...</p>
              </div>
            ) : (
              <>
                {/* ─── Profile Tab ─── */}
                {activeTab === 'Profile' && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                      <div className="relative w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600 text-2xl font-bold">
                            {fullName ? fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "AD"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-bold rounded-lg transition-colors shadow-sm cursor-pointer text-center">
                          Change Photo
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        <p className="text-xs text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Full Name</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Email Address (Read-only)</label>
                        <input 
                          type="email" 
                          value={email}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none text-sm cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Phone Number</label>
                        <input 
                          type="text" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Date of Birth</label>
                        <input 
                          type="date" 
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-bold text-gray-900">Address</label>
                        <input 
                          type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                        />
                      </div>
                    </div>

                    {/* Change Password Section */}
                    <form onSubmit={handleChangePassword} className="pt-8 border-t border-gray-100 space-y-6">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-500" /> Change Password
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-900">Current Password</label>
                          <div className="relative">
                            <input 
                              type={showCurrent ? "text" : "password"} 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="********" 
                              required
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrent(!showCurrent)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div></div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-900">New Password</label>
                          <div className="relative">
                            <input 
                              type={showNew ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="********" 
                              required
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowNew(!showNew)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-900">Confirm New Password</label>
                          <div className="relative">
                            <input 
                              type={showConfirm ? "text" : "password"} 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="********" 
                              required
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirm(!showConfirm)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={saveLoading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2"
                      >
                        {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {/* ─── Privacy Policy & Terms tabs ─── */}
                {(activeTab === 'Privacy Policy' || activeTab === 'Terms Condition') && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">Edit the content for {activeTab}. This will be visible to users.</p>
                    
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap gap-1">
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Bold className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Italic className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><Underline className="w-4 h-4" /></button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><List className="w-4 h-4" /></button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><AlignLeft className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><AlignCenter className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><AlignRight className="w-4 h-4" /></button>
                      </div>
                      <textarea 
                        rows={15} 
                        value={activeTab === 'Privacy Policy' ? privacyContent : termsContent}
                        onChange={(e) => activeTab === 'Privacy Policy' ? setPrivacyContent(e.target.value) : setTermsContent(e.target.value)}
                        className="w-full p-4 focus:outline-none text-sm text-gray-700 font-mono"
                        placeholder={`Enter ${activeTab} content here...`}
                      ></textarea>
                    </div>
                  </div>
                )}
                {/* ─── Help & Support Settings ─── */}
                {activeTab === 'Help & Support' && (
                  <div className="space-y-6 max-w-2xl">
                    <p className="text-sm text-gray-500">Edit the Help & Support information displayed to customers.</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Support Message</label>
                        <textarea 
                          rows={3}
                          value={supportText}
                          onChange={(e) => setSupportText(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                          placeholder="Need assistance with your bookings..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Support Email Address</label>
                        <input 
                          type="email" 
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                          placeholder="support@amraoui.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Operating Hours</label>
                        <input 
                          type="text" 
                          value={supportHours}
                          onChange={(e) => setSupportHours(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                          placeholder="Mon - Fri, 9:00 - 18:00 CET."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Response Time</label>
                        <input 
                          type="text" 
                          value={supportResponseTime}
                          onChange={(e) => setSupportResponseTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm" 
                          placeholder="Usually under 2 hours"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── FAQ Tab ─── */}
                {activeTab === 'FAQ' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500">Manage frequently asked questions here.</p>
                      <button 
                        onClick={() => {
                          setFaqQuestion("");
                          setFaqAnswer("");
                          setIsAddFaqModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> Add FAQ
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                          <div className="w-full p-4 flex justify-between items-center bg-gray-50/30 hover:bg-gray-50">
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            >
                              <span className="font-bold text-gray-900 text-sm">{faq.q}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedFaq(faq);
                                  setFaqQuestion(faq.q);
                                  setFaqAnswer(faq.a);
                                  setIsEditFaqModalOpen(true);
                                }}
                                className="text-gray-400 hover:text-blue-600 p-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="text-gray-400 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div 
                                className="cursor-pointer p-1"
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                              >
                                {expandedFaq === index ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                              </div>
                            </div>
                          </div>
                          {expandedFaq === index && (
                            <div className="p-4 bg-white text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Admin Management Tab ─── */}
                {activeTab === 'Admin Management' && (
                  currentUserRole !== 'SUPER_ADMIN' ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                        <Shield className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Super Admin Only</h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        You are currently logged in as {currentUserRole}. Only Super Admins can manage administrative credentials.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Admin Management</h3>
                          <p className="text-xs text-gray-500">View, search, and manage all admin accounts</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setIsAddAdminModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Plus className="w-4 h-4" /> Add Admin
                          </button>
                        </div>
                      </div>

                      {/* Search and Tabs */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder="Search admins..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex bg-gray-150 p-1 bg-gray-100 rounded-xl text-xs">
                          {["All", "Active", "Suspended"].map(filterVal => (
                            <button
                              key={filterVal}
                              onClick={() => setStatusFilter(filterVal)}
                              className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                                statusFilter === filterVal ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {filterVal}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admins Table */}
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-xs text-gray-600">
                          <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left">#</th>
                              <th className="px-4 py-3 text-left">Admin</th>
                              <th className="px-4 py-3 text-left">Phone Number</th>
                              <th className="px-4 py-3 text-left">Role</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredAdmins.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                  No admin accounts found matching criteria.
                                </td>
                              </tr>
                            ) : (
                              filteredAdmins.map((admin, idx) => {
                                const isBlocked = admin.authId?.is_block;
                                return (
                                  <tr key={admin._id}>
                                    <td className="px-4 py-4">{idx + 1}</td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                          {admin.name ? admin.name[0].toUpperCase() : 'A'}
                                        </div>
                                        <div>
                                          <p className="font-bold text-gray-900">{admin.name}</p>
                                          <p className="text-gray-400 text-[10px]">{admin.email}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">{admin.phone_number || 'N/A'}</td>
                                    <td className="px-4 py-4 font-bold text-gray-700">{admin.authId?.role || 'ADMIN'}</td>
                                    <td className="px-4 py-4">
                                      <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                                        isBlocked ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                                      }`}>
                                        {isBlocked ? 'Suspended' : 'Active'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => {
                                            setSelectedAdmin(admin);
                                            setIsViewAdminModalOpen(true);
                                          }}
                                          className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                          onClick={() => handleToggleBlockAdmin(admin)}
                                          title={isBlocked ? "Activate Admin" : "Suspend Admin"}
                                          className={`transition-colors ${isBlocked ? 'text-green-500 hover:text-green-600' : 'text-red-400 hover:text-red-600'}`}
                                        >
                                          <Shield className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Add Admin Modal ─── */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 relative">
              <button onClick={() => setIsAddAdminModalOpen(false)} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Add New Admin</h2>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={adminLastName}
                    onChange={(e) => setAdminLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+33 6 00 00 00 00" 
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Admin Email</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input 
                    type={showAdminPassword ? "text" : "password"} 
                    placeholder="********" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={saveLoading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2 flex items-center justify-center gap-2 text-sm shadow-md"
              >
                {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Admin Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add FAQ Modal ─── */}
      {isAddFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 relative">
              <button onClick={() => setIsAddFaqModalOpen(false)} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Add New FAQ</h2>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Question</label>
                <input 
                  type="text" 
                  placeholder="Enter FAQ Question..." 
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Answer</label>
                <textarea 
                  rows={4} 
                  placeholder="Enter FAQ Answer..." 
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
              </div>

              <button 
                onClick={handleAddFaq}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2 text-sm shadow-md"
              >
                Add FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit FAQ Modal ─── */}
      {isEditFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 relative">
              <button onClick={() => setIsEditFaqModalOpen(false)} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Edit FAQ</h2>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Question</label>
                <input 
                  type="text" 
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Answer</label>
                <textarea 
                  rows={4} 
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
              </div>

              <button 
                onClick={handleEditFaq}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2 text-sm shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Admin Modal ─── */}
      {isViewAdminModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 relative">
              <button onClick={() => setIsViewAdminModalOpen(false)} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Admin Details</h2>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl mb-2">
                  {selectedAdmin.name ? selectedAdmin.name[0].toUpperCase() : 'A'}
                </div>
                <h3 className="font-bold text-gray-900 text-base">{selectedAdmin.name}</h3>
                <p className="text-gray-400">{selectedAdmin.email}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone Number:</span>
                  <span className="font-bold text-gray-900">{selectedAdmin.phone_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined Date:</span>
                  <span className="font-bold text-gray-900">
                    {selectedAdmin.createdAt ? new Date(selectedAdmin.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Role:</span>
                  <span className="font-bold text-blue-600">{selectedAdmin.authId?.role || 'ADMIN'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] ${
                    selectedAdmin.authId?.is_block ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {selectedAdmin.authId?.is_block ? 'Suspended' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  onClick={() => handleToggleBlockAdmin(selectedAdmin)}
                  className={`flex-1 py-2 border rounded-lg font-bold transition-colors text-center text-xs ${
                    selectedAdmin.authId?.is_block 
                      ? 'border-green-200 text-green-600 hover:bg-green-50' 
                      : 'border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  {selectedAdmin.authId?.is_block ? 'Activate Admin Account' : 'Suspend Admin Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;