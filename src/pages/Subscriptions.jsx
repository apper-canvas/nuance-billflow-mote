import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { subscriptionService, customerService, productService } from '../services';

const SubscriptionForm = ({ subscription, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: subscription?.customerId || '',
    productId: subscription?.productId || '',
    startDate: subscription?.startDate || new Date().toISOString().split('T')[0],
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
      status: 'active'
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
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Customer *
            </label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Product *
            </label>
            <select
              required
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && selectedProduct.pricing && (
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Select Pricing *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedProduct.pricing.map((pricing, index) => (
                  <motion.button
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
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {subscription ? 'Update' : 'Create'} Subscription
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const SubscriptionCard = ({ subscription, customer, product, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-accent/10 text-accent';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 break-words">
            {customer?.name || 'Unknown Customer'}
          </h3>
          <p className="text-surface-600 break-words">{product?.name || 'Unknown Product'}</p>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onToggleStatus(subscription)}
            className="p-2 text-surface-500 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <ApperIcon name={subscription.status === 'active' ? 'Pause' : 'Play'} size={16} />
          </button>
          <button
            onClick={() => onDelete(subscription.id)}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subscriptionsData, customersData, productsData] = await Promise.all([
        subscriptionService.getAll(),
        customerService.getAll(),
        productService.getAll()
      ]);
      setSubscriptions(subscriptionsData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionService.delete(id);
        setSubscriptions(subscriptions.filter(s => s.id !== id));
        toast.success('Subscription deleted successfully');
      } catch (error) {
        toast.error('Failed to delete subscription');
      }
    }
  };

  const handleToggleStatus = async (subscription) => {
    const newStatus = subscription.status === 'active' ? 'paused' : 'active';
    try {
      await subscriptionService.update(subscription.id, { ...subscription, status: newStatus });
      setSubscriptions(subscriptions.map(s => 
        s.id === subscription.id ? { ...s, status: newStatus } : s
      ));
      toast.success(`Subscription ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update subscription status');
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingSubscription(null);
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSubscription(null);
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const customer = customers.find(c => c.id === subscription.customerId);
    const product = products.find(p => p.id === subscription.productId);
    
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Subscriptions</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-4 bg-surface-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Subscriptions</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Subscriptions</h1>
            <p className="text-surface-600 mt-1">Manage recurring billing and subscriptions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Subscription
          </motion.button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <ApperIcon name="Search" className="absolute left-3 top-2.5 text-surface-400" size={18} />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="Repeat" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No subscriptions found' : 'No subscriptions yet'}
          </h3>
          <p className="text-surface-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Create your first subscription to start recurring billing'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Subscription
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSubscriptions.map((subscription, index) => {
              const customer = customers.find(c => c.id === subscription.customerId);
              const product = products.find(p => p.id === subscription.productId);
              
              return (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SubscriptionCard
                    subscription={subscription}
                    customer={customer}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <SubscriptionForm
            subscription={editingSubscription}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subscriptions;