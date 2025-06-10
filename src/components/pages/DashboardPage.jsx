import React from 'react';
import { motion } from 'framer-motion';
import DashboardOverview from '@/components/organisms/DashboardOverview';

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-600 mt-1">Overview of your billing operations</p>
      </div>
      
      <DashboardOverview />
    </motion.div>
  );
};

export default DashboardPage;