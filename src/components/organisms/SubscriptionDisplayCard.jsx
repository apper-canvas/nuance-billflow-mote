import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const SubscriptionDisplayCard = ({ subscription, customer, product, onEdit, onDelete, onToggleStatus, motionProps }) => {
  return (
    <Panel
      motionProps={{
        layout: true,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        whileHover: { scale: 1.02 },
        ...motionProps
      }}
      className="hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 break-words">
            {customer?.name || 'Unknown Customer'}
          </h3>
          <p className="text-surface-600 break-words">{product?.name || 'Unknown Product'}</p>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <Button
            onClick={() => onEdit(subscription)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            onClick={() => onToggleStatus(subscription)}
            className="p-2 text-surface-500 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <ApperIcon name={subscription.status === 'active' ? 'Pause' : 'Play'} size={16} />
          </Button>
          <Button
            onClick={() => onDelete(subscription.id)}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Amount:</span>
          <span className="font-medium text-surface-900">${subscription.amount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Billing Cycle:</span>
          <span className="text-sm text-surface-900 capitalize">{subscription.billingCycle}</span>
        </div>

        {subscription.nextBillingDate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-surface-600">Next Billing:</span>
            <span className="text-sm text-surface-900">
              {format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-surface-600">Status:</span>
          <StatusBadge status={subscription.status} />
        </div>
      </div>
    </Panel>
  );
};

export default SubscriptionDisplayCard;