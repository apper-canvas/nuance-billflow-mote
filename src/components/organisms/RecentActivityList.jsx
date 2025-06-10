import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import RecentActivityItem from '@/components/molecules/RecentActivityItem';
import Panel from '@/components/atoms/Panel';

const RecentActivityList = ({ activities }) => (
  <Panel className="p-0">
    <div className="p-6 border-b border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900">Recent Activity</h3>
    </div>
    <div className="p-6">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Activity" size={48} className="text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <RecentActivityItem
                key={index}
                message={activity.message}
                time={activity.time}
                icon={activity.icon}
                color={activity.color}
                motionProps={{
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.1 }
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  </Panel>
);

export default RecentActivityList;