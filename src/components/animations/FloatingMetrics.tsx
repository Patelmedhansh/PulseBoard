import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, MemoryStick as Memory, Network } from 'lucide-react';

const metrics = [
  { icon: Activity, label: 'CPU Usage', value: '45%', color: 'text-primary-500' },
  { icon: Memory, label: 'Memory', value: '2.4GB', color: 'text-secondary-500' },
  { icon: Network, label: 'Network', value: '1.2MB/s', color: 'text-accent-500' },
  { icon: Cpu, label: 'Processes', value: '124', color: 'text-success-500' },
];

export function FloatingMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="bg-background-light p-4 rounded-lg border border-primary-500/20 shadow-glow"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`p-2 rounded-lg ${metric.color} bg-opacity-20`}
            >
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </motion.div>
            <div>
              <div className="text-sm text-gray-400">{metric.label}</div>
              <div className="text-xl font-bold">{metric.value}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}