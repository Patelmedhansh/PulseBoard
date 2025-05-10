import React, { useState, useEffect } from 'react';
import { Application, Metric } from '../../utils/types';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Activity, Cpu, MemoryStick as Memory, Network } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../utils/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsPanelProps {
  application: Application;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ application }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('metrics')
          .select('*')
          .eq('application_id', application.id)
          .order('timestamp', { ascending: false })
          .limit(60); // Last 60 data points

        if (error) throw error;
        if (data) setMetrics(data.reverse());
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const subscription = supabase
      .channel('metrics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'metrics',
        filter: `application_id=eq.${application.id}`,
      }, (payload) => {
        setMetrics(current => [...current.slice(-59), payload.new as Metric]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [application.id]);

  const getLatestMetric = () => metrics[metrics.length - 1] || null;

  return (
    <div className="bg-white dark:bg-background-light rounded-lg shadow-md overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-lg flex items-center">
          <Activity className="h-5 w-5 text-primary-500 mr-2" />
          Real-time Metrics
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          ) : getLatestMetric() ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/50 p-4 rounded-lg border border-primary-500/20">
                  <div className="flex items-center mb-2">
                    <Cpu className="h-5 w-5 text-primary-500 mr-2" />
                    <h4 className="font-medium">CPU Usage</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    {getLatestMetric()?.cpu_usage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(getLatestMetric()?.timestamp || '').toLocaleTimeString()}
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-lg border border-secondary-500/20">
                  <div className="flex items-center mb-2">
                    <Memory className="h-5 w-5 text-secondary-500 mr-2" />
                    <h4 className="font-medium">Memory Usage</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    {getLatestMetric()?.memory_usage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(getLatestMetric()?.timestamp || '').toLocaleTimeString()}
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-lg border border-accent-500/20">
                  <div className="flex items-center mb-2">
                    <Network className="h-5 w-5 text-accent-500 mr-2" />
                    <h4 className="font-medium">Network Traffic</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    ↑ {(getLatestMetric()?.network_tx || 0).toFixed(1)} MB/s
                    <br />
                    ↓ {(getLatestMetric()?.network_rx || 0).toFixed(1)} MB/s
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(getLatestMetric()?.timestamp || '').toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="mt-8 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      contentStyle={{ 
                        backgroundColor: '#151B2E',
                        border: '1px solid rgba(79, 70, 229, 0.2)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cpu_usage" 
                      stroke="#4F46E5" 
                      name="CPU Usage (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory_usage" 
                      stroke="#06B6D4" 
                      name="Memory Usage (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No metrics available</h4>
              <p className="text-gray-500">
                Waiting for metrics data from your application...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};