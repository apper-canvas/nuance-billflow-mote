import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    pricing: product?.pricing || [{ amount: '', billingCycle: 'monthly' }],
    taxable: product?.taxable || false
  });

  const addPricingTier = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { amount: '', billingCycle: 'monthly' }]
    });
  };

  const removePricingTier = (index) => {
    const newPricing = formData.pricing.filter((_, i) => i !== index);
    setFormData({ ...formData, pricing: newPricing });
  };

  const updatePricingTier = (index, field, value) => {
    const newPricing = formData.pricing.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setFormData({ ...formData, pricing: newPricing });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate pricing tiers
    const validPricing = formData.pricing.filter(tier => tier.amount && parseFloat(tier.amount) > 0);
    if (validPricing.length === 0) {
      toast.error('Please add at least one valid pricing tier');
      return;
    }

    const finalData = {
      ...formData,
      pricing: validPricing.map(tier => ({
        ...tier,
        amount: parseFloat(tier.amount)
      }))
    };

    try {
      if (product) {
        await productService.update(product.id, finalData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(finalData);
        toast.success('Product created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Product Name *"
            id="productName"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <FormField
            label="Description"
            id="productDescription"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>
                Pricing Tiers *
              </Label>
              <Button
                type="button"
                onClick={addPricingTier}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                + Add Tier
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.pricing.map((tier, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-surface-200 rounded-lg">
                  <div className="flex-1">
                    <FormField
                      id={`pricingAmount-${index}`}
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={tier.amount}
                      onChange={(e) => updatePricingTier(index, 'amount', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      id={`billingCycle-${index}`}
                      type="select"
                      value={tier.billingCycle}
                      onChange={(e) => updatePricingTier(index, 'billingCycle', e.target.value)}
                      selectOptions={[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'yearly', label: 'Yearly' },
                        { value: 'one-time', label: 'One-time' }
                      ]}
                    />
                  </div>
                  {formData.pricing.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePricingTier(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <Input
              type="checkbox"
              id="taxable"
              checked={formData.taxable}
              onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
            />
            <Label htmlFor="taxable" className="ml-2 mb-0">
              This product is taxable
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {product ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;