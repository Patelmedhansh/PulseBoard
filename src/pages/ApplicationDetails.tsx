import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { MetricsPanel } from '../components/dashboard/MetricsPanel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { Application } from '../utils/types';
import { ArrowLeft, Activity, Clock, CalendarCheck, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      if (!session.user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        
        setApplication(data);
        document.title = `${data.name} | Pulseboard`;
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err as Error);
        toast.error('Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    };

    if (session.user && !session.isLoading) {
      fetchApplication();
    }
  }, [id, session]);

  const handleNewApplication = () => {
    // This is just a placeholder - the actual functionality will be in the Sidebar component
  };

  if (!session.user && !session.isLoading) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <Sidebar onAddApplication={handleNewApplication} />

      <div className="md:ml-64 p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/applications')}
            className="mb-6"
          >
            Back to Applications
          </Button>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-background-light rounded w-1/4"></div>
              <div className="h-4 bg-background-light rounded w-1/3"></div>
              <div className="h-64 bg-background-light rounded mt-6"></div>
            </div>
          ) : error ? (
            <div className="bg-error-900/20 border border-error-800 text-error-300 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Error Loading Application</h3>
              <p>There was a problem loading this application. It may not exist or you may not have permission to view it.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/applications')}
              >
                Return to Applications
              </Button>
            </div>
          ) : application ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-900/50 rounded-full mr-4">
                    <Activity className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{application.name}</h1>
                    <p className="text-gray-400">
                      {application.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="primary">
                    Refresh Metrics
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-background-light p-4 rounded-lg flex items-center">
                  <div className="p-3 bg-primary-900/50 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="font-medium">
                      {new Date(application.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-background-light p-4 rounded-lg flex items-center">
                  <div className="p-3 bg-green-900/50 rounded-full mr-3">
                    <CalendarCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created On</p>
                    <p className="font-medium">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-background-light p-4 rounded-lg flex items-center">
                  <div className="p-3 bg-purple-900/50 rounded-full mr-3">
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Endpoint</p>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {application.metrics_endpoint}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <MetricsPanel application={application} />

                <div className="bg-white dark:bg-background-light rounded-lg shadow-md overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-medium text-lg">Integration Details</h3>
                  </div>
                  <div className="p-4">
                    <div className="bg-gray-50 dark:bg-background p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Configuration Information</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Metrics Endpoint:</p>
                          <code className="bg-gray-100 dark:bg-background-light p-2 rounded block text-sm overflow-x-auto">
                            {application.metrics_endpoint}
                          </code>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prometheus Scrape Config:</p>
                          <code className="bg-gray-100 dark:bg-background-light p-2 rounded block text-sm overflow-x-auto whitespace-pre">
                            {`# Add this to your prometheus.yml
scrape_configs:
  - job_name: '${application.name}'
    static_configs:
      - targets: ['your-host:port']
    metrics_path: '${application.metrics_endpoint}'`}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-background-light rounded-lg shadow-md overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-medium text-lg">Application Status</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        application.status === 'active' 
                          ? 'bg-success-500' 
                          : application.status === 'error' 
                            ? 'bg-error-500' 
                            : 'bg-gray-500'
                      } mr-2`}></div>
                      <span className="capitalize">{application.status}</span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-background p-3 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Health Check Status</p>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-success-500 mr-2"></div>
                          <span>Healthy</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-background p-3 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Successful Scrape</p>
                        <span>5 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-warning-900/20 border border-warning-800 text-warning-300 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Application Not Found</h3>
              <p>The application you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/applications')}
              >
                Return to Applications
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};