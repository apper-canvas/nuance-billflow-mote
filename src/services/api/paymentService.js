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
  }
};

export default paymentService;