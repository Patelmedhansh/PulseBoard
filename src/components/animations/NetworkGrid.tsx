import React from 'react';
import { motion } from 'framer-motion';

export function NetworkGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #4F46E5 1px, transparent 1px),
            linear-gradient(to bottom, #4F46E5 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'top',
        }}
      />
      
      <motion.div
        animate={{
          y: [0, 100],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/10 to-transparent"
      />
    </div>
  );
}