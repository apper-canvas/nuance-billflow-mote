import paymentsData from '../mockData/payments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let payments = [...paymentsData];

const paymentService = {
  async getAll() {
    await delay(300);
    return [...payments];
  },

  async getById(id) {
    await delay(200);
    const payment = payments.find(p => p.id === id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return { ...payment };
  },

  async create(paymentData) {
    await delay(400);
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    return { ...newPayment };
  },

  async update(id, paymentData) {
    await delay(350);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }
    
    payments[index] = {
      ...payments[index],
      ...paymentData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...payments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }
    
    payments.splice(index, 1);
return { success: true };
  },

  // Stripe-specific methods
  async processStripePayment(paymentData) {
    await delay(1000); // Simulate Stripe API call
    
    try {
      // Simulate Stripe payment processing
      const mockStripeResponse = {
        id: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: Math.round(paymentData.amount * 100), // Stripe uses cents
        currency: 'usd',
        payment_method: paymentData.stripePaymentMethodId
      };

      // Create payment record
      const newPayment = {
        ...paymentData,
        id: Date.now().toString(),
        stripePaymentIntentId: mockStripeResponse.id,
        status: 'completed',
        reference: `stripe_${mockStripeResponse.id}`,
        createdAt: new Date().toISOString()
      };

      payments.push(newPayment);

      return {
        success: true,
        payment: newPayment,
        stripeData: mockStripeResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Stripe payment processing failed'
      };
    }
  },

  async handleWebhook(webhookData) {
    await delay(200);
    
    try {
      const { type, data } = webhookData;
      
      switch (type) {
        case 'payment_intent.succeeded':
          const paymentIntentId = data.object.id;
          const payment = payments.find(p => p.stripePaymentIntentId === paymentIntentId);
          
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
          
        case 'payment_intent.payment_failed':
          const failedPaymentId = data.object.id;
          const failedPayment = payments.find(p => p.stripePaymentIntentId === failedPaymentId);
          
          if (failedPayment) {
            const index = payments.findIndex(p => p.id === failedPayment.id);
            payments[index] = {
              ...failedPayment,
              status: 'failed',
              failureReason: data.object.last_payment_error?.message,
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

  async getStripePayments() {
    await delay(300);
    const stripePayments = payments.filter(p => p.method === 'stripe');
    return [...stripePayments];
  }
};

export default paymentService;