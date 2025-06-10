import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const PaymentDisplayCard = ({ payment, invoice, customer, onEdit, onDelete, motionProps }) => {
  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return 'CreditCard';
      case 'bank_transfer': return 'Building2';
      case 'check': return 'FileCheck';
      case 'cash': return 'Banknote';
      case 'paypal': return 'Wallet';
      case 'stripe': return 'CreditCard';
      default: return 'DollarSign';
    }
  };

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
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name={getMethodIcon(payment.method)} size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">${payment.amount.toFixed(2)}</h3>
              <p className="text-surface-600 text-sm capitalize break-words">
                {payment.method.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          {customer && (
            <p className="text-surface-600 text-sm break-words">{customer.name}</p>
          )}
          
          {invoice && (
            <p className="text-surface-500 text-sm break-words">
              Invoice #{invoice.id.slice(-6)}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2 ml-4">
          <Button
            onClick={() => onEdit(payment)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            onClick={() => onDelete(payment.id)}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-600">Date:</span>
          <span className="text-sm text-surface-900">
            {format(new Date(payment.date), 'MMM dd, yyyy')}
          </span>
        </div>
        
        {payment.reference && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-surface-600">Reference:</span>
            <span className="text-sm text-surface-900 font-mono break-words">{payment.reference}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-surface-600">Status:</span>
          <StatusBadge status={payment.status} />
        </div>
      </div>
    </Panel>
  );
};

export default PaymentDisplayCard;