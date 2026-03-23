import React, { useState } from 'react';
import { User, Shield, Bell, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock initial state for settings
  const [profile, setProfile] = useState({
    username: 'Admin User',
    email: 'admin@stockmaster.com',
    companyName: 'StockMaster Inc.',
    timezone: 'UTC+5:45 (Kathmandu)',
    notificationsEnabled: true
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsSubmitting(false);
    }, 800);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <User size={18} /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Shield size={18} /> Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preferences' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Bell size={18} /> Preferences
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
          
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company/Shop Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={profile.companyName}
                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-start">
                  <button 
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                  >
                    <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Update Password</h2>
              <p className="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-start">
                  <button 
                    disabled={isSubmitting || !passwords.current || !passwords.new}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Application Preferences</h2>
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select 
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={profile.timezone}
                    onChange={(e) => {
                      setProfile({...profile, timezone: e.target.value});
                      toast.success('Timezone updated');
                    }}
                  >
                    <option value="UTC+5:45 (Kathmandu)">UTC+5:45 (Kathmandu)</option>
                    <option value="UTC+5:30 (India)">UTC+5:30 (India)</option>
                    <option value="UTC (GMT)">UTC (GMT)</option>
                  </select>
                </div>
                
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="notifications"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                    checked={profile.notificationsEnabled}
                    onChange={(e) => {
                      setProfile({...profile, notificationsEnabled: e.target.checked});
                      toast.success('Notification preference updated');
                    }}
                  />
                  <div>
                    <label htmlFor="notifications" className="text-sm font-medium text-gray-900 cursor-pointer block">
                      Low Stock Alerts
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Receive alerts when tracking inventory items fall below 5.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
