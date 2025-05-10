import React from 'react';
import { Application } from '../../utils/types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LineChart, ExternalLink } from 'lucide-react';

interface GrafanaDashboardProps {
  application: Application;
}

export const GrafanaDashboard: React.FC<GrafanaDashboardProps> = ({ application }) => {
  // This will be provided by your hosted Grafana instance
  const grafanaUrl = import.meta.env.VITE_GRAFANA_URL;
  const dashboardUrl = `${grafanaUrl}/d/app-metrics/application-metrics?orgId=1&var-app=${application.name}&var-app_id=${application.id}`;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <LineChart className="h-5 w-5 text-primary-500" />
          <CardTitle>Metrics Dashboard</CardTitle>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </CardHeader>
      
      <CardContent>
        <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border border-primary-500/20">
          <iframe
            src={`${dashboardUrl}&theme=dark&kiosk`}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`Metrics Dashboard for ${application.name}`}
          />
        </div>

        <div className="mt-4 p-4 bg-background rounded-lg border border-primary-500/20">
          <h4 className="font-medium mb-2">Metrics Information</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="font-medium text-gray-300">Endpoint:</span>{' '}
              {application.metrics_endpoint}
            </p>
            <p>
              <span className="font-medium text-gray-300">Status:</span>{' '}
              <span className={application.status === 'active' ? 'text-success-500' : 'text-error-500'}>
                {application.status === 'active' ? 'Collecting metrics' : 'Not collecting metrics'}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};