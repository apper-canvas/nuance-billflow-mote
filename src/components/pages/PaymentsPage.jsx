import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PaymentForm from '@/components/organisms/PaymentForm';
import PaymentDisplayCard from '@/components/organisms/PaymentDisplayCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { paymentService, invoiceService, customerService } from '@/services';

const PaymentsPage = () => {
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
    
    const matchesSearch = (customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.amount.toString().includes(searchTerm));
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
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
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
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Record Payment
          </Button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <ApperIcon name="Search" className="absolute left-3 top-2.5 text-surface-400" size={18} />
          </div>
          
          <Select
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
            <option value="stripe">🔒 Stripe</option>
          </Select>
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
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Record First Payment
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPayments.map((payment, index) => {
              const invoice = invoices.find(inv => inv.id === payment.invoiceId);
              const customer = customers.find(c => c.id === invoice?.customerId);
              
              return (
                <PaymentDisplayCard
                  key={payment.id}
                  payment={payment}
                  invoice={invoice}
                  customer={customer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  motionProps={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 }
                  }}
                />
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

export default PaymentsPage;