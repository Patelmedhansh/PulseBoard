import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Application } from '../../utils/types';

interface NewAppFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => Promise<void>;
  isLoading: boolean;
}

export const NewAppForm: React.FC<NewAppFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metricsEndpoint, setMetricsEndpoint] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    metricsEndpoint: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      name: name.trim() === '' ? 'Name is required' : '',
      metricsEndpoint: metricsEndpoint.trim() === '' ? 'Metrics endpoint is required' : '',
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.metricsEndpoint) {
      return;
    }
    
    await onSubmit({
      name,
      description,
      metrics_endpoint: metricsEndpoint,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setMetricsEndpoint('');
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Application">
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Application Name"
              placeholder="My Application"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your application"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <Input
              label="Metrics Endpoint"
              placeholder="/metrics"
              value={metricsEndpoint}
              onChange={(e) => setMetricsEndpoint(e.target.value)}
              error={errors.metricsEndpoint}
              required
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                The metrics endpoint should be a Prometheus-compatible URL that provides metrics data, like <code>/metrics</code> or <code>https://your-app.com/metrics</code>.
              </p>
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Add Application
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};