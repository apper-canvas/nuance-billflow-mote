import React from 'react';
import Panel from '@/components/atoms/Panel';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ title, value, icon, change, color = "primary", motionProps }) => (
  <Panel motionProps={motionProps} className="hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-surface-600">{title}</p>
        <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <ApperIcon 
              name={change > 0 ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={change > 0 ? "text-accent mr-1" : "text-red-500 mr-1"} 
            />
            <span className={`text-sm ${change > 0 ? "text-accent" : "text-red-500"}`}>
              {Math.abs(change)}% vs last month
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 bg-${color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
        <ApperIcon name={icon} size={24} className={`text-${color}`} />
      </div>
    </div>
  </Panel>
);

export default MetricCard;