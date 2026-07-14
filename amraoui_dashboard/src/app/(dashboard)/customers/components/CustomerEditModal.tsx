import React, { useState, useEffect } from 'react';
import { UserPlus, X, Users, Loader2, Edit } from 'lucide-react';
import { ICustomerRecord } from '../page';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app';

export const CustomerEditModal = ({
  isOpen,
  onClose,
  onSuccess,
  customer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: ICustomerRecord | null;
}) => {
  const [form, setForm] = useState({
    name: '', family_name: '', company: '', tax_number: '',
    phone_number: '', email: '', password: '', message: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer && isOpen) {
      setForm({
        name: customer.name || '',
        family_name: customer.family_name || '',
        company: customer.company || '',
        tax_number: customer.tax_number || '',
        phone_number: customer.phone_number || '',
        email: customer.email || '',
        password: '',
        message: customer.message || '',
      });
      setProfileImage(customer.profile_image || null);
      setImageFile(null);
      setError('');
    }
  }, [customer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const formData = new FormData();
      
      const dataToSubmit: any = { ...form };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      formData.append('data', JSON.stringify(dataToSubmit));
      
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/customers/${customer._id}`, {
        method: 'PATCH',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update customer');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-extrabold text-gray-900">Edit Customer</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center gap-2 pb-2">
            <div className="relative w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <label className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
              Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">First Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Family Name</label>
              <input name="family_name" value={form.family_name} onChange={handleChange} placeholder="Doe"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="Company LLC"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Tax Number</label>
              <input name="tax_number" value={form.tax_number} onChange={handleChange} placeholder="TAX-123456"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Email *</label>
              <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="john@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Phone Number</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+1234567890"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">New Password (optional)</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="••••••••" minLength={6}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Notes / Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Internal notes..." rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {error && (
            <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠ {error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Edit className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
