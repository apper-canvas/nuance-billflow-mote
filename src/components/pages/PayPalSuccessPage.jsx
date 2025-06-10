import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import paypalService from '@/services/api/paypalService';

const PayPalSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');

  useEffect(() => {
    const processPayment = async () => {
      if (!token) {
        setError('Invalid payment token');
        setLoading(false);
        return;
      }

      try {
        // Get payment details from session storage
        const pendingPayment = sessionStorage.getItem('pendingPayPalPayment');
        if (!pendingPayment) {
          setError('Payment session expired');
          setLoading(false);
          return;
        }

        const paymentData = JSON.parse(pendingPayment);
        
        // Capture the payment
        const result = await paypalService.capturePayment(token, paymentData);
        
        if (result.success) {
          setPayment(result.payment);
          toast.success('Payment completed successfully!');
          
          // Clean up session storage
          sessionStorage.removeItem('pendingPayPalPayment');
        } else {
          setError(result.error || 'Payment processing failed');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('PayPal payment processing error:', err);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [token, payerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              Processing Your Payment
            </h2>
            <p className="text-surface-600">
              Please wait while we confirm your PayPal payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ApperIcon name="XCircle" className="text-red-600" size={32} />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-surface-600 mb-6">
              {error}
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/payments')}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Return to Payments
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="CheckCircle" className="text-green-600" size={32} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-surface-600 mb-6">
              Your PayPal payment has been processed successfully.
            </p>
          </motion.div>

          {payment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface-50 rounded-lg p-4 mb-6 text-left"
            >
              <h3 className="font-medium text-surface-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">Amount:</span>
                  <span className="font-medium">${payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Payment Method:</span>
                  <span className="font-medium">PayPal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Transaction ID:</span>
                  <span className="font-medium font-mono text-xs">{payment.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button
              onClick={() => navigate('/payments')}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <ApperIcon name="FileText" size={16} className="mr-2" />
              View Payment History
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Return to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PayPalSuccessPage;