import React, { useState } from 'react';
import { Application } from '../../utils/types';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MetricsPanelProps {
  application: Application;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ application }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-background-light rounded-lg shadow-md overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-lg flex items-center">
          Metrics Dashboard
          <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
            Grafana
          </span>
        </h3>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <motion.div
        initial={{ height: 'auto' }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'overflow-hidden',
          !isExpanded && 'hidden'
        )}
      >
        <div className="p-4">
          <div className="bg-gray-100 dark:bg-background text-center p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-4">
              <img 
                src="https://static.crozdesk.com/web_app_library/providers/logos/000/003/237/original/grafana-1559230097-logo.png?1559230097" 
                alt="Grafana Logo" 
                className="w-16 h-16"
              />
              <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Grafana Dashboard Placeholder
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                This is where the Grafana dashboard for {application.name} will be embedded. 
                Grafana needs to be set up locally and integrated via iframe.
              </p>
              <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 text-sm">
                <ExternalLink size={16} />
                <span>Integration instructions in documentation</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-background/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Local Grafana Setup</h4>
              <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal pl-4 space-y-1">
                <li>Install Grafana locally or via Docker</li>
                <li>Configure Prometheus as a data source</li>
                <li>Point Prometheus to the metrics endpoint: <code className="text-xs bg-gray-200 dark:bg-background px-1 py-0.5 rounded">{application.metrics_endpoint}</code></li>
                <li>Create dashboards for your application metrics</li>
                <li>Once set up, the dashboard will appear here</li>
              </ol>
            </div>
            <div className="bg-gray-50 dark:bg-background/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Sample Metrics</h4>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="mb-2">Common metrics you might want to monitor:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>CPU and Memory Usage</li>
                  <li>Request Rates and Latencies</li>
                  <li>Error Rates</li>
                  <li>Queue Depths</li>
                  <li>Database Connection Pool Stats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};