import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { invoiceService, customerService, productService } from '@/services';

const InvoiceForm = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || '',
    items: invoice?.items || [{ productId: '', quantity: 1, price: 0 }],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: invoice?.taxRate || 0.1
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          customerService.getAll(),
          productService.getAll()
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        toast.error('Failed to load form data');
      }
    };
    loadData();
  }, []);

  const addLineItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0 }]
    });
  };

  const removeLineItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateLineItem = (index, field, value) => {
    const newItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-fill price when product is selected
        if (field === 'productId' && value) {
          const product = products.find(p => p.id === value);
          if (product && product.pricing && product.pricing.length > 0) {
            updatedItem.price = product.pricing[0].amount;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
    
    const tax = subtotal * (parseFloat(formData.taxRate) || 0);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || formData.items.length === 0) {
      toast.error('Please select a customer and add at least one item');
      return;
    }

    const validItems = formData.items.filter(item => 
      item.productId && item.quantity > 0 && item.price > 0
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    
    const finalData = {
      ...formData,
      items: validItems.map(item => ({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      })),
      subtotal,
      tax,
      total,
      status: invoice?.status || 'pending', // Preserve status if editing, else default to pending
      createdAt: invoice?.createdAt || new Date().toISOString(),
      dueDate: new Date(formData.dueDate).toISOString()
    };

    try {
      if (invoice) {
        await invoiceService.update(invoice.id, finalData);
        toast.success('Invoice updated successfully');
      } else {
        await invoiceService.create(finalData);
        toast.success('Invoice created successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save invoice');
    }
  };

  const { subtotal, tax, total } = calculateTotals();

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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Customer *"
              id="customerId"
              type="select"
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              selectOptions={customers.map(c => ({ value: c.id, label: `${c.name} (${c.email})` }))}
            >
              <option value="">Select a customer</option>
            </FormField>

            <FormField
              label="Due Date *"
              id="dueDate"
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-medium text-surface-700">
                Line Items *
              </span>
              <Button
                type="button"
                onClick={addLineItem}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                + Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-surface-200 rounded-lg">
                  <div className="md:col-span-5">
                    <FormField
                      id={`productId-${index}`}
                      type="select"
                      value={item.productId}
                      onChange={(e) => updateLineItem(index, 'productId', e.target.value)}
                      selectOptions={products.map(p => ({ value: p.id, label: p.name }))}
                    >
                      <option value="">Select product</option>
                    </FormField>
                  </div>
                  
                  <div className="md:col-span-2">
                    <FormField
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <FormField
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateLineItem(index, 'price', e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-900">
                      ${((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                    </span>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-surface-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tax Rate (%)"
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-surface-600">Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-surface-200 pt-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
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
              {invoice ? 'Update' : 'Create'} Invoice
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceForm;