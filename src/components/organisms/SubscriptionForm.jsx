import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { subscriptionService, customerService, productService } from '@/services';

const SubscriptionForm = ({ subscription, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: subscription?.customerId || '',
    productId: subscription?.productId || '',
    startDate: subscription?.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    billingCycle: subscription?.billingCycle || 'monthly',
    amount: subscription?.amount || ''
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          customerService.getAll(),
          productService.getAll()
        ]);
        setCustomers(customersData);
        setProducts(productsData);

        if (subscription?.productId) {
          const product = productsData.find(p => p.id === subscription.productId);
          setSelectedProduct(product);
        }
      } catch (error) {
        toast.error('Failed to load form data');
      }
    };
    loadData();
  }, [subscription]);

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setFormData({ ...formData, productId, amount: '' });
  };

  const handlePricingSelect = (pricing) => {
    setFormData({
      ...formData,
      amount: pricing.amount,
      billingCycle: pricing.billingCycle
    });
  };

  const calculateNextBillingDate = (startDate, billingCycle) => {
    const start = new Date(startDate);
    switch (billingCycle) {
      case 'monthly':
        start.setMonth(start.getMonth() + 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() + 3);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() + 1);
        break;
      default:
        return null;
    }
    return start.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.productId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const nextBillingDate = calculateNextBillingDate(formData.startDate, formData.billingCycle);
    
    const finalData = {
      ...formData,
      amount: parseFloat(formData.amount),
      startDate: new Date(formData.startDate).toISOString(),
      nextBillingDate,
      status: subscription?.status || 'active'
    };

    try {
      if (subscription) {
        await subscriptionService.update(subscription.id, finalData);
        toast.success('Subscription updated successfully');
      } else {
        await subscriptionService.create(finalData);
        toast.success('Subscription created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save subscription');
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
            {subscription ? 'Edit Subscription' : 'Create New Subscription'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Customer *"
            id="customerId"
            type="select"
            required
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            selectOptions={customers.map(customer => ({ value: customer.id, label: `${customer.name} (${customer.email})` }))}
          >
            <option value="">Select a customer</option>
          </FormField>

          <FormField
            label="Product *"
            id="productId"
            type="select"
            required
            value={formData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            selectOptions={products.map(product => ({ value: product.id, label: product.name }))}
          >
            <option value="">Select a product</option>
          </FormField>

          {selectedProduct && selectedProduct.pricing && (
            <div>
              <span className="block text-sm font-medium text-surface-700 mb-3">
                Select Pricing *
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedProduct.pricing.map((pricing, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handlePricingSelect(pricing)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      formData.amount === pricing.amount && formData.billingCycle === pricing.billingCycle
                        ? 'border-primary bg-primary/5'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{pricing.billingCycle}</span>
                      <span className="text-lg font-bold">${pricing.amount}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Date *"
              id="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <FormField
              label="Amount *"
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
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
              {subscription ? 'Update' : 'Create'} Subscription
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionForm;