const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Stripe configuration service
let stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  currency: 'usd',
  enabled: false
};

const stripeService = {
  async getConfig() {
    await delay(200);
    return { ...stripeConfig };
  },

  async updateConfig(config) {
    await delay(300);
    stripeConfig = { ...stripeConfig, ...config };
    return { ...stripeConfig };
  },

  async validateKeys(publishableKey, secretKey) {
    await delay(500);
    
    // Mock validation - in real implementation, this would test the keys
    const isValid = publishableKey.startsWith('pk_') && secretKey.startsWith('sk_');
    
    return {
      valid: isValid,
      message: isValid ? 'Keys validated successfully' : 'Invalid Stripe keys format'
    };
  },

  async processPayment(paymentData) {
    await delay(1000);
    
    try {
      // Mock Stripe payment processing
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount: Math.round(paymentData.amount * 100),
        currency: stripeConfig.currency,
        status: 'succeeded',
        payment_method: paymentData.paymentMethodId,
        created: Math.floor(Date.now() / 1000)
      };

      return {
        success: true,
        paymentIntent,
        clientSecret: `${paymentIntent.id}_secret_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  },

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    await delay(400);
    
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Date.now()}`,
      metadata
    };

    return paymentIntent;
  },

  async confirmPayment(paymentIntentId, paymentMethodId) {
    await delay(800);
    
    // Mock payment confirmation
    return {
      id: paymentIntentId,
      status: 'succeeded',
      payment_method: paymentMethodId,
      amount_received: 2000, // Mock amount in cents
      charges: {
        data: [{
          id: `ch_${Date.now()}`,
          receipt_url: `https://pay.stripe.com/receipts/mock_${Date.now()}`
        }]
      }
    };
  },

  async handleWebhookEvent(event) {
    await delay(200);
    
    const { type, data } = event;
    
    switch (type) {
      case 'payment_intent.succeeded':
        return {
          success: true,
          action: 'payment_confirmed',
          paymentIntentId: data.object.id
        };
        
      case 'payment_intent.payment_failed':
        return {
          success: true,
          action: 'payment_failed',
          paymentIntentId: data.object.id,
          error: data.object.last_payment_error
        };
        
      case 'charge.dispute.created':
        return {
          success: true,
          action: 'dispute_created',
          chargeId: data.object.charge
        };
        
      default:
        return {
          success: true,
          action: 'unhandled_event',
          eventType: type
        };
    }
  },

  async getPaymentMethods(customerId) {
    await delay(300);
    
    // Mock customer payment methods
    return {
      data: [
        {
          id: `pm_${Date.now()}`,
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        }
      ]
    };
  },

  async createCustomer(customerData) {
    await delay(400);
    
    return {
      id: `cus_${Date.now()}`,
      email: customerData.email,
      name: customerData.name,
      created: Math.floor(Date.now() / 1000)
    };
  }
};

export default stripeService;