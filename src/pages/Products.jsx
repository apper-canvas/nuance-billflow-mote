import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { productService } from '../services';

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
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-surface-700">
                Pricing Tiers *
              </label>
              <button
                type="button"
                onClick={addPricingTier}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                + Add Tier
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.pricing.map((tier, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-surface-200 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={tier.amount}
                      onChange={(e) => updatePricingTier(index, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={tier.billingCycle}
                      onChange={(e) => updatePricingTier(index, 'billingCycle', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                  {formData.pricing.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePricingTier(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxable"
              checked={formData.taxable}
              onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
              className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
            />
            <label htmlFor="taxable" className="ml-2 text-sm text-surface-700">
              This product is taxable
            </label>
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
              {product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all"
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
            Active
          </span>
        </div>
      </div>
      
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onEdit(product)}
          className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <ApperIcon name="Edit2" size={16} />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-full"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Products</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
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
            <h1 className="text-2xl font-bold text-surface-900">Products</h1>
            <p className="text-surface-600 mt-1">Manage your product catalog and pricing</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Product
          </motion.button>
        </div>

        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <ApperIcon name="Search" className="absolute left-3 top-2.5 text-surface-400" size={18} />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="Package" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-surface-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Create your first product to start billing customers'
            }
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Product
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;