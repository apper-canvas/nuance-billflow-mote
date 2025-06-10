import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickActionCard = ({ title, description, icon, onClick, color = "primary", motionProps }) => (
  <Button
    onClick={onClick}
    className="bg-white rounded-lg p-4 shadow-sm border border-surface-200 text-left w-full hover:shadow-md transition-shadow"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...motionProps}
  >
    <div className="flex items-start">
      <div className={`w-10 h-10 bg-${color} bg-opacity-10 rounded-lg flex items-center justify-center mr-3`}>
        <ApperIcon name={icon} size={20} className={`text-${color}`} />
      </div>
      <div>
        <h3 className="font-medium text-surface-900">{title}</h3>
        <p className="text-sm text-surface-600 mt-1">{description}</p>
      </div>
    </div>
  </Button>
);

export default QuickActionCard;