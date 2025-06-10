import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { paymentService, invoiceService, customerService } from '../services';

const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    amount: payment?.amount || '',
    method: payment?.method || 'credit_card',
    reference: payment?.reference || '',
    date: payment?.date || new Date().toISOString().split('T')[0]
  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const invoicesData = await invoiceService.getAll();
        const pendingInvoices = invoicesData.filter(inv => inv.status !== 'paid');
        setInvoices(pendingInvoices);

        if (payment?.invoiceId) {
          const invoice = invoicesData.find(inv => inv.id === payment.invoiceId);
          setSelectedInvoice(invoice);
        }
      } catch (error) {
        toast.error('Failed to load invoices');
      }
    };
    loadInvoices();
  }, [payment]);

  const handleInvoiceSelect = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    setSelectedInvoice(invoice);
    setFormData({
      ...formData,
      invoiceId,
      amount: invoice ? invoice.total.toString() : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.invoiceId || !formData.amount) {
      toast.error('Please select an invoice and enter amount');
      return;
    }

    const finalData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      status: 'completed'
    };

    try {
      if (payment) {
        await paymentService.update(payment.id, finalData);
        toast.success('Payment updated successfully');
      } else {
        await paymentService.create(finalData);
        
        // Update invoice status if payment amount matches total
        if (selectedInvoice && parseFloat(formData.amount) >= selectedInvoice.total) {
          await invoiceService.update(selectedInvoice.id, {
            ...selectedInvoice,
            status: 'paid'
          });
        }
        
        toast.success('Payment recorded successfully');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save payment');
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
            {payment ? 'Edit Payment' : 'Record New Payment'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Invoice *
            </label>
            <select
              required
              value={formData.invoiceId}
              onChange={(e) => handleInvoiceSelect(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an invoice</option>
              {invoices.map(invoice => (
                <option key={invoice.id} value={invoice.id}>
                  Invoice #{invoice.id.slice(-6)} - ${invoice.total.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className="bg-surface-50 p-4 rounded-lg">
              <h4 className="font-medium text-surface-900 mb-2">Invoice Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-surface-600">Total Amount:</span>
                  <span className="font-medium ml-2">${selectedInvoice.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-surface-600">Due Date:</span>
                  <span className="ml-2">{format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Payment Method *
              </label>
              <select
                required
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Reference Number
            </label>
            <input
              type="text"
              placeholder="Transaction ID, check number, etc."
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
              {payment ? 'Update' : 'Record'} Payment
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PaymentCard = ({ payment, invoice, customer, onEdit, onDelete }) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-accent/10 text-accent';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
          <button
            onClick={() => onEdit(payment)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(payment.id)}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
            {payment.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paymentsData, invoicesData, customersData] = await Promise.all([
        paymentService.getAll(),
        invoiceService.getAll(),
        customerService.getAll()
      ]);
      setPayments(paymentsData);
      setInvoices(invoicesData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentService.delete(id);
        setPayments(payments.filter(p => p.id !== id));
        toast.success('Payment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete payment');
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingPayment(null);
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const filteredPayments = payments.filter(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    const customer = customers.find(c => c.id === invoice?.customerId);
    
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.amount.toString().includes(searchTerm);
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Payments</h1>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Payments</h3>
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
            <h1 className="text-2xl font-bold text-surface-900">Payments</h1>
            <p className="text-surface-600 mt-1">Track and manage payment records</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Record Payment
          </motion.button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <ApperIcon name="Search" className="absolute left-3 top-2.5 text-surface-400" size={18} />
          </div>
          
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="CreditCard" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            {searchTerm || methodFilter !== 'all' ? 'No payments found' : 'No payments yet'}
          </h3>
          <p className="text-surface-600 mb-6">
            {searchTerm || methodFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start recording payments when you receive them'
            }
          </p>
          {!searchTerm && methodFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Record First Payment
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPayments.map((payment, index) => {
              const invoice = invoices.find(inv => inv.id === payment.invoiceId);
              const customer = customers.find(c => c.id === invoice?.customerId);
              
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PaymentCard
                    payment={payment}
                    invoice={invoice}
                    customer={customer}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <PaymentForm
            payment={editingPayment}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Payments;