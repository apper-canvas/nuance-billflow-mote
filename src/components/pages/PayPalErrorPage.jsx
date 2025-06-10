import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PayPalErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState({
    message: 'Payment was cancelled or failed',
    code: null,
    description: null
  });

  useEffect(() => {
    // Extract error information from URL parameters
    const errorCode = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const token = searchParams.get('token');

    // Clean up any pending payment data
    sessionStorage.removeItem('pendingPayPalPayment');

    // Set error details based on parameters
    if (errorCode) {
      setErrorDetails({
        message: getErrorMessage(errorCode),
        code: errorCode,
        description: errorDescription
      });
    } else if (!token) {
      setErrorDetails({
        message: 'Payment session expired or was cancelled',
        code: 'CANCELLED',
        description: 'The payment process was not completed'
      });
    }
  }, [searchParams]);

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'CANCELLED': 'Payment was cancelled by user',
      'DECLINED': 'Payment was declined by PayPal',
      'EXPIRED': 'Payment session has expired',
      'INVALID_TOKEN': 'Invalid payment token',
      'INSUFFICIENT_FUNDS': 'Insufficient funds in PayPal account',
      'PAYMENT_DENIED': 'Payment was denied by PayPal',
      'INSTRUMENT_DECLINED': 'Payment method was declined',
      'PAYER_CANNOT_PAY': 'Unable to process payment for this account'
    };

    return errorMessages[errorCode] || 'An error occurred during payment processing';
  };

  const handleRetryPayment = () => {
    // Navigate back to payments page to retry
    navigate('/payments');
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support ticket or contact form
    const supportEmail = 'support@billflow.com';
    const subject = `PayPal Payment Error - ${errorDetails.code || 'Unknown'}`;
    const body = `Hello,\n\nI encountered an error while processing a PayPal payment:\n\nError: ${errorDetails.message}\nCode: ${errorDetails.code || 'N/A'}\nDescription: ${errorDetails.description || 'N/A'}\n\nPlease assist me with this issue.\n\nThank you.`;
    
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="AlertCircle" className="text-red-600" size={32} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              Payment Unsuccessful
            </h2>
            <p className="text-surface-600 mb-6">
              {errorDetails.message}
            </p>
          </motion.div>

          {(errorDetails.code || errorDetails.description) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left"
            >
              <h3 className="font-medium text-red-900 mb-2 flex items-center">
                <ApperIcon name="Info" size={16} className="mr-2" />
                Error Details
              </h3>
              <div className="space-y-1 text-sm">
                {errorDetails.code && (
                  <div>
                    <span className="text-red-700 font-medium">Code:</span>
                    <span className="text-red-600 ml-2">{errorDetails.code}</span>
                  </div>
                )}
                {errorDetails.description && (
                  <div>
                    <span className="text-red-700 font-medium">Details:</span>
                    <span className="text-red-600 ml-2">{errorDetails.description}</span>
                  </div>
                )}
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
              onClick={handleRetryPayment}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Try Payment Again
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Return to Dashboard
            </Button>

            <Button
              onClick={handleContactSupport}
              className="w-full px-4 py-2 text-surface-500 hover:text-surface-700 transition-colors flex items-center justify-center"
            >
              <ApperIcon name="Mail" size={16} className="mr-2" />
              Contact Support
            </Button>
          </motion.div>
        </div>

        {/* Common Issues Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-surface-200"
        >
          <h3 className="font-medium text-surface-900 mb-3 text-center">Common Solutions</h3>
          <div className="space-y-2 text-sm text-surface-600">
            <div className="flex items-start">
              <ApperIcon name="Dot" size={16} className="mr-2 mt-1 text-surface-400" />
              <span>Check your PayPal account balance and payment methods</span>
            </div>
            <div className="flex items-start">
              <ApperIcon name="Dot" size={16} className="mr-2 mt-1 text-surface-400" />
              <span>Ensure your PayPal account is verified</span>
            </div>
            <div className="flex items-start">
              <ApperIcon name="Dot" size={16} className="mr-2 mt-1 text-surface-400" />
              <span>Try using a different payment method in PayPal</span>
            </div>
            <div className="flex items-start">
              <ApperIcon name="Dot" size={16} className="mr-2 mt-1 text-surface-400" />
              <span>Contact your bank if the issue persists</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayPalErrorPage;