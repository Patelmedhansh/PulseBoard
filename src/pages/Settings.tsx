import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { User } from '../utils/types';
import { UserCog, Bell, Shield, Database, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { session, updateProfile, signOut } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({
    full_name: '',
    avatar_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Settings | PulseBoard';
  }, []);

  useEffect(() => {
    if (!session.isLoading && !session.user) {
      navigate('/auth/login');
    } else if (session.user) {
      setFormData({
        full_name: session.user.full_name || '',
        avatar_url: session.user.avatar_url || '',
      });
    }
  }, [session, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updateProfile(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleNewApplication = () => {
    navigate('/applications', { state: { openNewAppModal: true } });
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <Sidebar onAddApplication={handleNewApplication} />

      <div className="md:ml-64 p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-background-light rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-700">
                  <UserCog className="h-5 w-5 mr-2 text-primary-500" />
                  <h2 className="text-lg font-medium">Profile Settings</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <Input
                        label="Email"
                        type="email"
                        value={session.user?.email || ''}
                        disabled
                      />
                      
                      <Input
                        label="Full Name"
                        name="full_name"
                        placeholder="Your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                      
                      <Input
                        label="Avatar URL"
                        name="avatar_url"
                        placeholder="https://example.com/avatar.jpg"
                        value={formData.avatar_url}
                        onChange={handleChange}
                      />
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="bg-background-light rounded-lg shadow-md overflow-hidden mt-6">
                <div className="flex items-center p-4 border-b border-gray-700">
                  <Database className="h-5 w-5 mr-2 text-secondary-500" />
                  <h2 className="text-lg font-medium">Data Management</h2>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-300 mb-4">
                    Manage your application data and export options
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-medium mb-2">Export Options</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Export your application data for backup or analysis
                      </p>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          Export as JSON
                        </Button>
                        <Button variant="outline" size="sm">
                          Export as CSV
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-700 rounded-lg bg-error-900/10 border-error-900/30">
                      <h3 className="font-medium mb-2 text-error-400">Danger Zone</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="outline" size="sm" className="text-error-500 border-error-500 hover:bg-error-900/20">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-background-light rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-700">
                  <Bell className="h-5 w-5 mr-2 text-accent-500" />
                  <h2 className="text-lg font-medium">Notifications</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Alerts</p>
                        <p className="text-sm text-gray-400">Receive alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Error Notifications</p>
                        <p className="text-sm text-gray-400">Get notified about errors</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Performance Alerts</p>
                        <p className="text-sm text-gray-400">Alerts for performance issues</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background-light rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-700">
                  <Shield className="h-5 w-5 mr-2 text-success-500" />
                  <h2 className="text-lg font-medium">Security</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-light transition-colors">
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-400">Update your account password</p>
                    </button>
                    
                    <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-light transition-colors">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Enable extra security</p>
                    </button>
                    
                    <button 
                      className="w-full text-left p-3 rounded-lg bg-background hover:bg-background-light transition-colors flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2 text-gray-400" />
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-sm text-gray-400">Log out of your account</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};