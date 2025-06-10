import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RecentActivityItem = ({ message, time, icon, color, motionProps }) => (
  <motion.div
    className="flex items-center"
    {...motionProps}
  >
    <div className={`w-8 h-8 bg-${color} bg-opacity-10 rounded-full flex items-center justify-center mr-3`}>
      <ApperIcon name={icon} size={16} className={`text-${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-surface-900 break-words">{message}</p>
      <p className="text-xs text-surface-500">{time}</p>
    </div>
  </motion.div>
);

export default RecentActivityItem;