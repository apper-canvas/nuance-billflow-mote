import paymentsData from '../mockData/payments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let payments = [...paymentsData];

const paypalService = {
  // PayPal configuration
  getPayPalConfig() {
    return {
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AQlMhQ7Dw7hL8Z2XMqU5v-VHVUGPvQ8rK5X8GJ9Q8tJ8vJ8tJ8vJ8tJ8vJ8tJ8vJ8t',
      currency: 'USD',
      intent: 'capture',
      environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox'
    };
  },

  // Create PayPal order
  async createOrder(paymentData) {
    await delay(500);
    
    try {
      const orderId = `PAYPAL_${Date.now()}`;
      
      // Mock PayPal order creation response
      const mockPayPalOrder = {
        id: orderId,
        status: 'CREATED',
        amount: {
          currency_code: 'USD',
          value: paymentData.amount.toString()
        },
        create_time: new Date().toISOString(),
        links: [
          {
            href: `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
            rel: 'self',
            method: 'GET'
          },
          {
            href: `${window.location.origin}/paypal/success?token=${orderId}`,
            rel: 'approve',
            method: 'GET'
          }
        ]
      };

      return {
        success: true,
        orderId: orderId,
        approveUrl: mockPayPalOrder.links.find(link => link.rel === 'approve')?.href,
        order: mockPayPalOrder
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'PayPal order creation failed'
      };
    }
  },

  // Capture PayPal payment
  async capturePayment(orderId, paymentData) {
    await delay(800);
    
    try {
      // Mock PayPal capture response
      const mockCaptureResponse = {
        id: orderId,
        status: 'COMPLETED',
        payment_source: {
          paypal: {
            email_address: 'customer@example.com',
            account_id: 'PAYPAL123456789'
          }
        },
        purchase_units: [
          {
            reference_id: 'default',
            amount: {
              currency_code: 'USD',
              value: paymentData.amount.toString()
            },
            payments: {
              captures: [
                {
                  id: `CAP_${Date.now()}`,
                  status: 'COMPLETED',
                  amount: {
                    currency_code: 'USD',
                    value: paymentData.amount.toString()
                  },
                  final_capture: true,
                  create_time: new Date().toISOString()
                }
              ]
            }
          }
        ]
      };

      // Create payment record
      const newPayment = {
        ...paymentData,
        id: Date.now().toString(),
        method: 'paypal',
        paypalOrderId: orderId,
        paypalCaptureId: mockCaptureResponse.purchase_units[0].payments.captures[0].id,
        status: 'completed',
        reference: `paypal_${orderId}`,
        paypalData: mockCaptureResponse,
        createdAt: new Date().toISOString()
      };

      payments.push(newPayment);

      return {
        success: true,
        payment: newPayment,
        captureData: mockCaptureResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'PayPal payment capture failed'
      };
    }
  },

  // Get PayPal payment details
  async getPaymentDetails(orderId) {
    await delay(300);
    
    try {
      const payment = payments.find(p => p.paypalOrderId === orderId);
      
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found'
        };
      }

      return {
        success: true,
        payment: { ...payment }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get payment details'
      };
    }
  },

  // Handle PayPal webhook
  async handleWebhook(webhookData) {
    await delay(200);
    
    try {
      const { event_type, resource } = webhookData;
      
      switch (event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          const orderId = resource.supplementary_data?.related_ids?.order_id;
          const payment = payments.find(p => p.paypalOrderId === orderId);
          
          if (payment) {
            const index = payments.findIndex(p => p.id === payment.id);
            payments[index] = {
              ...payment,
              status: 'completed',
              webhookProcessedAt: new Date().toISOString()
            };
            return { success: true, message: 'Payment confirmed' };
          }
          break;
          
        case 'PAYMENT.CAPTURE.DENIED':
        case 'PAYMENT.CAPTURE.DECLINED':
          const failedOrderId = resource.supplementary_data?.related_ids?.order_id;
          const failedPayment = payments.find(p => p.paypalOrderId === failedOrderId);
          
          if (failedPayment) {
            const index = payments.findIndex(p => p.id === failedPayment.id);
            payments[index] = {
              ...failedPayment,
              status: 'failed',
              failureReason: resource.reason_code || 'Payment declined',
              webhookProcessedAt: new Date().toISOString()
            };
            return { success: true, message: 'Payment failure recorded' };
          }
          break;
          
        default:
          return { success: true, message: 'Webhook event not handled' };
      }
      
      return { success: false, message: 'Payment not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get PayPal payments
  async getPayPalPayments() {
    await delay(300);
    const paypalPayments = payments.filter(p => p.method === 'paypal');
    return [...paypalPayments];
  },

  // Validate PayPal credentials
  async validateCredentials(clientId, clientSecret) {
    await delay(1000);
    
    try {
      // Mock credential validation
      if (!clientId || !clientSecret) {
        return {
          success: false,
          error: 'Client ID and Client Secret are required'
        };
      }

      if (clientId.length < 10 || clientSecret.length < 10) {
        return {
          success: false,
          error: 'Invalid credential format'
        };
      }

      return {
        success: true,
        message: 'PayPal credentials validated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Credential validation failed'
      };
    }
  }
};

export default paypalService;