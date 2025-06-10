import React from 'react';
import { motion } from 'framer-motion';
import ReportsOverview from '@/components/organisms/ReportsOverview';

const ReportsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
        <p className="text-surface-600 mt-1">Financial insights and business metrics</p>
      </div>

      <ReportsOverview />
    </motion.div>
  );
};

export default ReportsPage;