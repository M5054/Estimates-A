import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, MapPin, Save, AlertCircle, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../lib/api/profiles';
import { uploadLogo, deleteLogo } from '../lib/api/storage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import Button from '../components/shared/Button';

const BusinessDetails: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    business_name: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_zip: '',
    business_website: '',
    business_logo: '',
  });

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        setFormData({
          business_name: profile.business_name || '',
          business_email: profile.business_email || '',
          business_phone: profile.business_phone || '',
          business_address: profile.business_address || '',
          business_city: profile.business_city || '',
          business_state: profile.business_state || '',
          business_zip: profile.business_zip || '',
          business_website: profile.business_website || '',
          business_logo: profile.business_logo || '',
        });
        if (profile.business_logo) {
          setLogoPreview(profile.business_logo);
        }
      } catch (err) {
        setError('Failed to load business details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, business_logo: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      let logoUrl = formData.business_logo;
      
      // Handle logo upload/removal
      if (logoFile) {
        // Upload new logo
        logoUrl = await uploadLogo(logoFile, user.id);
      } else if (formData.business_logo && !logoPreview) {
        // Logo was removed
        await deleteLogo(formData.business_logo);
        logoUrl = '';
      }

      await updateProfile(user.id, {
        ...formData,
        business_logo: logoUrl,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save business details');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your business information and logo. This will appear on your estimates.
          </p>

          {error && <ErrorMessage message={error} />}
          
          {success && (
            <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Business details saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Logo</label>
              <div className="mt-2 flex items-center space-x-6">
                <div className="flex-shrink-0 h-24 w-24 rounded-lg border border-gray-200 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business Logo"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="business_name"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_email" className="block text-sm font-medium text-gray-700">
                  Business Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="business_email"
                    id="business_email"
                    value={formData.business_email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_phone" className="block text-sm font-medium text-gray-700">
                  Business Phone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="business_phone"
                    id="business_phone"
                    value={formData.business_phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="business_website"
                    id="business_website"
                    value={formData.business_website}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="business_address" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="business_address"
                  id="business_address"
                  value={formData.business_address}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="business_city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="business_city"
                    id="business_city"
                    value={formData.business_city}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="business_state"
                    id="business_state"
                    value={formData.business_state}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business_zip" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="business_zip"
                    id="business_zip"
                    value={formData.business_zip}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  icon={Save}
                  loading={saving}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;