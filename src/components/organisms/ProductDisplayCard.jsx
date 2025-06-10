import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const ProductDisplayCard = ({ product, onEdit, onDelete, motionProps }) => (
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
        <h3 className="text-lg font-semibold text-surface-900 break-words">{product.name}</h3>
        {product.description && (
          <p className="text-surface-600 text-sm mt-1 break-words">{product.description}</p>
        )}
        
        <div className="mt-3 space-y-2">
          {product.pricing?.map((tier, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-surface-700 capitalize">{tier.billingCycle}</span>
              <span className="font-medium text-surface-900">${tier.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center space-x-2">
          {product.taxable && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Taxable
            </span>
          )}
          <StatusBadge status="active" /> {/* Assuming all products displayed are active */}
        </div>
      </div>
      
      <div className="flex space-x-2 ml-4">
        <Button
          onClick={() => onEdit(product)}
          className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ApperIcon name="Edit2" size={16} />
        </Button>
        <Button
          onClick={() => onDelete(product.id)}
          className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  </Panel>
);

export default ProductDisplayCard;