import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { paymentService, invoiceService } from '@/services';

const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    amount: payment?.amount || '',
    method: payment?.method || 'credit_card',
    reference: payment?.reference || '',
    date: payment?.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
          <FormField
            label="Invoice *"
            id="invoiceId"
            type="select"
            required
            value={formData.invoiceId}
            onChange={(e) => handleInvoiceSelect(e.target.value)}
            selectOptions={invoices.map(invoice => ({ 
              value: invoice.id, 
              label: `Invoice #${invoice.id.slice(-6)} - $${invoice.total.toFixed(2)}` 
            }))}
          >
            <option value="">Select an invoice</option>
          </FormField>

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
            <FormField
              label="Amount *"
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <FormField
              label="Payment Method *"
              id="method"
              type="select"
              required
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              selectOptions={[
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'check', label: 'Check' },
                { value: 'cash', label: 'Cash' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'stripe', label: 'Stripe' }
              ]}
            />
          </div>

          <FormField
            label="Payment Date *"
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <FormField
            label="Reference Number"
            id="reference"
            type="text"
            placeholder="Transaction ID, check number, etc."
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />

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
              {payment ? 'Update' : 'Record'} Payment
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentForm;