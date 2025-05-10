import React, { useState } from 'react';
import { AlertConfig } from '../../utils/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Bell, AlertTriangle } from 'lucide-react';

interface AlertConfigFormProps {
  applicationId: string;
  onSubmit: (config: Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: AlertConfig;
  isLoading?: boolean;
}

export const AlertConfigForm: React.FC<AlertConfigFormProps> = ({
  applicationId,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<AlertConfig>>({
    application_id: applicationId,
    type: initialData?.type || 'cpu',
    threshold_value: initialData?.threshold_value || 80,
    channel_type: initialData?.channel_type || 'webhook',
    channel_config: initialData?.channel_config || {},
    enabled: initialData?.enabled ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-medium">Alert Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alert Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as AlertConfig['type'] })}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100"
          >
            <option value="cpu">CPU Usage</option>
            <option value="memory">Memory Usage</option>
            <option value="error_rate">Error Rate</option>
          </select>
        </div>

        <Input
          label="Threshold Value"
          type="number"
          value={formData.threshold_value}
          onChange={(e) => setFormData({ ...formData, threshold_value: parseFloat(e.target.value) })}
          min={0}
          max={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notification Channel
          </label>
          <select
            value={formData.channel_type}
            onChange={(e) => setFormData({ ...formData, channel_type: e.target.value as AlertConfig['channel_type'] })}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100"
          >
            <option value="webhook">Webhook</option>
            <option value="email">Email</option>
          </select>
        </div>

        {formData.channel_type === 'webhook' ? (
          <Input
            label="Webhook URL"
            type="url"
            value={formData.channel_config?.url || ''}
            onChange={(e) => setFormData({
              ...formData,
              channel_config: { ...formData.channel_config, url: e.target.value }
            })}
            placeholder="https://your-webhook-url"
          />
        ) : (
          <Input
            label="Email Address"
            type="email"
            value={formData.channel_config?.email || ''}
            onChange={(e) => setFormData({
              ...formData,
              channel_config: { ...formData.channel_config, email: e.target.value }
            })}
            placeholder="alerts@your-domain.com"
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enabled"
          checked={formData.enabled}
          onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="enabled" className="text-sm text-gray-700 dark:text-gray-300">
          Enable Alert
        </label>
      </div>

      <div className="bg-warning-900/20 border border-warning-800 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-warning-300">
          <p className="font-medium">Important Note</p>
          <p>
            Alerts will be processed by Prometheus Alertmanager. Make sure your application exposes metrics
            in Prometheus format at the configured metrics endpoint.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        Save Alert Configuration
      </Button>
    </form>
  );
};