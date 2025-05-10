import React from 'react';
import { Application } from '../../utils/types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Activity, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface AppCardProps {
  application: Application;
  onDelete: (id: string) => Promise<void>;
}

export const AppCard: React.FC<AppCardProps> = ({ application, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'error':
        return 'bg-error-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statusVariants = {
    active: {
      scale: [1, 1.2, 1],
      transition: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 2,
      },
    },
    inactive: {},
    error: {
      opacity: [1, 0.5, 1],
      transition: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 0.5,
      },
    },
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this application?')) {
      await onDelete(application.id);
    }
  };

  const handleViewDashboard = () => {
    navigate(`/applications/${application.id}`);
  };

  return (
    <Card 
      className="h-full flex flex-col hover:border-primary-500 dark:hover:border-primary-500 hover:border transition-all duration-200 hover:shadow-glow relative overflow-hidden group cursor-pointer"
      onClick={handleViewDashboard}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardContent className="flex-1 pt-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <motion.div 
              className="mr-3 p-2 bg-background-light rounded-md relative"
              whileHover={{ scale: 1.1 }}
              animate={{
                rotate: [0, 5, -5, 0],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              <Activity className="h-6 w-6 text-primary-500" />
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-md" />
            </motion.div>
            <div>
              <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                {application.name}
              </h3>
              <div className="flex items-center mt-1">
                <motion.div
                  className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(application.status)}`}
                  variants={statusVariants}
                  animate={application.status}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {application.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {application.description || 'No description provided.'}
        </p>

        <div className="bg-gray-100 dark:bg-background p-2 rounded-md text-sm mb-4">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Metrics Endpoint:</span>
            <code className="text-xs overflow-ellipsis overflow-hidden">{application.metrics_endpoint}</code>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Added: {new Date(application.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-light/50 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Trash2 size={16} />}
          onClick={handleDelete}
          className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ExternalLink size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDashboard();
          }}
          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          View Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};