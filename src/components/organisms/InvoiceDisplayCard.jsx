import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const InvoiceDisplayCard = ({ invoice, customer, onEdit, onDelete, onUpdateStatus, motionProps }) => {
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
            Invoice #{invoice.id.slice(-6)}
          </h3>
          <p className="text-surface-600 break-words">{customer?.name || 'Unknown Customer'}</p>
          <p className="text-surface-500 text-sm break-words">{customer?.email || ''}</p>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <Button
            onClick={() => onEdit(invoice)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          {invoice.status === 'pending' && (
            <Button
              onClick={() => onUpdateStatus(invoice.id, 'paid')}
              className="p-2 text-surface-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
            >
              <ApperIcon name="CheckCircle" size={16} />
            </Button>
          )}
          <Button
            onClick={() => onDelete(invoice.id)}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Amount:</span>
          <span className="font-bold text-lg text-surface-900">${invoice.total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Due Date:</span>
          <span className="text-sm text-surface-900">
            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Items:</span>
          <span className="text-sm text-surface-900">{invoice.items?.length || 0} item(s)</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-surface-600">Status:</span>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </Panel>
  );
};

export default InvoiceDisplayCard;