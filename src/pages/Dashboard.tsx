import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AppCard } from '../components/dashboard/AppCard';
import { NewAppForm } from '../components/dashboard/NewAppForm';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';
import { Plus, Search, AlertCircle, Activity, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { applications, isLoading, error, addApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openNewAppModal) {
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    document.title = 'Dashboard | PulseBoard';
  }, []);

  useEffect(() => {
    if (!session.isLoading && !session.user) {
      navigate('/auth/login');
    }
  }, [session, navigate]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddApplication = async (data: any) => {
    await addApplication(data);
  };

  const filteredApplications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return applications;
    
    return applications.filter(app => 
      app.name.toLowerCase().includes(query) ||
      app.description?.toLowerCase().includes(query) ||
      app.metrics_endpoint.toLowerCase().includes(query) ||
      app.status.toLowerCase().includes(query)
    );
  }, [applications, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <Sidebar onAddApplication={handleOpenModal} />

      <div className="md:ml-64 p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background-light rounded-lg p-6 mb-8 border border-primary-500/20 shadow-glow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent">
                  Welcome back, {session.user?.full_name || 'User'}
                </h1>
                <p className="text-gray-400 mt-1">
                  Monitor and manage your applications in real-time
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-5 w-5 text-gray-400" />}
                  className="w-full sm:w-auto md:w-64 bg-background/50"
                />
                <Button
                  leftIcon={<Plus size={18} />}
                  onClick={handleOpenModal}
                  className="shadow-glow whitespace-nowrap"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-background/50 p-4 rounded-lg border border-primary-500/20">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-900/50 rounded-lg mr-4">
                    <Activity className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent">
                      {getStatusCount('active')}
                    </div>
                    <div className="text-gray-400">Active Applications</div>
                  </div>
                </div>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-error-500/20">
                <div className="flex items-center">
                  <div className="p-2 bg-error-900/50 rounded-lg mr-4">
                    <AlertCircle className="h-6 w-6 text-error-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-white to-error-400 bg-clip-text text-transparent">
                      {getStatusCount('error')}
                    </div>
                    <div className="text-gray-400">Applications with Errors</div>
                  </div>
                </div>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-secondary-500/20">
                <div className="flex items-center">
                  <div className="p-2 bg-secondary-900/50 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-secondary-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-white to-secondary-400 bg-clip-text text-transparent">
                      {applications.length}
                    </div>
                    <div className="text-gray-400">Total Applications</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background-light rounded-lg h-64 animate-pulse border border-primary-500/10"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-error-900/20 border border-error-800 text-error-300 p-6 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error loading applications</p>
                <p className="text-sm mt-1">
                  There was a problem loading your applications. Please try again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-error-500/50 text-error-400 hover:bg-error-950"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-background-light rounded-lg p-8 text-center border border-primary-500/20">
              <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 relative">
                <Plus className="h-8 w-8 text-primary-400" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent">
                No applications yet
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start monitoring your first application by adding it to your dashboard.
              </p>
              <Button
                onClick={handleOpenModal}
                variant="primary"
                leftIcon={<Plus size={18} />}
                className="shadow-glow"
              >
                Add Your First Application
              </Button>
            </div>
          ) : (
            <>
              {searchQuery && filteredApplications.length === 0 ? (
                <div className="bg-background-light rounded-lg p-6 text-center border border-primary-500/20">
                  <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400">
                    No applications match your search query "{searchQuery}"
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredApplications.map((app) => (
                    <motion.div key={app.id} variants={itemVariants}>
                      <AppCard
                        application={app}
                        onDelete={deleteApplication}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <NewAppForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddApplication}
        isLoading={isLoading}
      />
    </div>
  );
};