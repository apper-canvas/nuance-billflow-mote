import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const CustomerDisplayCard = ({ customer, onEdit, onDelete, motionProps }) => (
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
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-surface-900 break-words">{customer.name}</h3>
        <p className="text-surface-600 break-words">{customer.email}</p>
        {customer.phone && (
          <p className="text-surface-500 text-sm break-words">{customer.phone}</p>
        )}
        <div className="mt-2">
          <StatusBadge status={customer.status} />
        </div>
        {customer.address && (customer.address.city || customer.address.state) && (
          <p className="text-surface-500 text-sm mt-1 break-words">
            {[customer.address.city, customer.address.state].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
      
      <div className="flex space-x-2 ml-4">
        <Button
          onClick={() => onEdit(customer)}
          className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ApperIcon name="Edit2" size={16} />
        </Button>
        <Button
          onClick={() => onDelete(customer.id)}
          className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  </Panel>
);

export default CustomerDisplayCard;