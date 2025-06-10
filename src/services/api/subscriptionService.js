import subscriptionsData from '../mockData/subscriptions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let subscriptions = [...subscriptionsData];

const subscriptionService = {
  async getAll() {
    await delay(300);
    return [...subscriptions];
  },

  async getById(id) {
    await delay(200);
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return { ...subscription };
  },

  async create(subscriptionData) {
    await delay(450);
    const newSubscription = {
      ...subscriptionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    subscriptions.push(newSubscription);
    return { ...newSubscription };
  },

  async update(id, subscriptionData) {
    await delay(350);
    const index = subscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Subscription not found');
    }
    
    subscriptions[index] = {
      ...subscriptions[index],
      ...subscriptionData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...subscriptions[index] };
  },

  async delete(id) {
    await delay(250);
    const index = subscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Subscription not found');
    }
    
    subscriptions.splice(index, 1);
    return { success: true };
  }
};

export default subscriptionService;