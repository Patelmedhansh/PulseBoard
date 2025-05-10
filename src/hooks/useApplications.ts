import { useState, useEffect } from 'react';
import { Application } from '../utils/types';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { session } = useAuth();

  const fetchApplications = async () => {
    if (!session.user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err as Error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const addApplication = async (application: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!session.user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...application,
          user_id: session.user.id,
          status: 'active',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setApplications([data, ...applications]);
        toast.success('Application added successfully');
      }
      
      return data;
    } catch (err) {
      console.error('Error adding application:', err);
      setError(err as Error);
      toast.error('Failed to add application');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setApplications(applications.filter(app => app.id !== id));
      toast.success('Application deleted successfully');
    } catch (err) {
      console.error('Error deleting application:', err);
      setError(err as Error);
      toast.error('Failed to delete application');
    }
  };

  useEffect(() => {
    if (session.user && !session.isLoading) {
      fetchApplications();
    } else if (!session.isLoading) {
      setApplications([]);
      setIsLoading(false);
    }
  }, [session.user, session.isLoading]);

  return {
    applications,
    isLoading,
    error,
    fetchApplications,
    addApplication,
    deleteApplication,
  };
};