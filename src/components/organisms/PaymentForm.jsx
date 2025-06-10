import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { paymentService, invoiceService } from '@/services';

// Initialize Stripe (in production, this should come from environment variables)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_stripe_key_placeholder');

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const StripeCheckoutForm = ({ formData, selectedInvoice, onPaymentSuccess, onCancel, payment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!formData.amount || !selectedInvoice) {
      toast.error('Please select an invoice and enter amount');
      return;
    }

    setProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: selectedInvoice.customerName,
        },
      });

      if (pmError) {
        setCardError(pmError.message);
        setProcessing(false);
        return;
      }

      // Process payment through service
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        method: 'stripe',
        stripePaymentMethodId: paymentMethod.id,
        status: 'processing',
        date: new Date().toISOString()
      };

      const result = await paymentService.processStripePayment(paymentData);
      
      if (result.requiresAction) {
        // Handle 3D Secure authentication
        const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret);
        
        if (confirmError) {
          setCardError(confirmError.message);
          setProcessing(false);
          return;
        }
      }

      if (result.success) {
        toast.success('Payment processed successfully');
        onPaymentSuccess();
      } else {
        setCardError(result.error || 'Payment failed');
      }
    } catch (error) {
      setCardError(error.message || 'Payment processing failed');
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleStripeSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <ApperIcon name="Shield" className="text-blue-600 mr-2" size={20} />
          <h4 className="font-medium text-blue-900">Secure Stripe Payment</h4>
        </div>
        <p className="text-blue-700 text-sm">Your payment information is encrypted and secure.</p>
      </div>

      {selectedInvoice && (
        <div className="bg-surface-50 p-4 rounded-lg">
          <h4 className="font-medium text-surface-900 mb-2">Payment Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-600">Amount:</span>
              <span className="font-medium ml-2">${parseFloat(formData.amount).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-surface-600">Invoice:</span>
              <span className="ml-2">#{selectedInvoice.id.slice(-6)}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Card Information *
        </label>
        <div className="border border-surface-300 rounded-lg p-3">
          <CardElement options={CARD_OPTIONS} onChange={(e) => setCardError(e.error?.message || null)} />
        </div>
        {cardError && (
          <div className="stripe-error mt-2 flex items-center">
            <ApperIcon name="AlertCircle" size={16} className="mr-1" />
            {cardError}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <ApperIcon name="CreditCard" size={16} className="mr-2" />
              Pay ${parseFloat(formData.amount || 0).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
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
  const [showStripeForm, setShowStripeForm] = useState(false);
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

  const handleMethodChange = (method) => {
    setFormData({ ...formData, method });
    setShowStripeForm(method === 'stripe');
  };

  const handleStripePaymentSuccess = () => {
    onSave();
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

  // If showing Stripe form, render it in Elements provider
  if (showStripeForm) {
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
              Process Stripe Payment
            </h2>
          </div>
          
          <div className="p-6">
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                formData={formData}
                selectedInvoice={selectedInvoice}
                onPaymentSuccess={handleStripePaymentSuccess}
                onCancel={() => setShowStripeForm(false)}
                payment={payment}
              />
            </Elements>
          </div>
        </motion.div>
      </motion.div>
    );
  }
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
              onChange={(e) => handleMethodChange(e.target.value)}
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

          {formData.method === 'stripe' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ApperIcon name="Info" className="text-yellow-600 mr-2" size={20} />
                <div>
                  <h4 className="font-medium text-yellow-800">Stripe Payment Processing</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Click "Process with Stripe" to continue with secure card payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Cancel
            </Button>
            {formData.method === 'stripe' ? (
              <Button
                type="button"
                onClick={() => {
                  if (!formData.invoiceId || !formData.amount) {
                    toast.error('Please select an invoice and enter amount');
                    return;
                  }
                  setShowStripeForm(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
              >
                <ApperIcon name="CreditCard" size={16} className="mr-2" />
                Process with Stripe
              </Button>
            ) : (
              <Button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {payment ? 'Update' : 'Record'} Payment
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentForm;