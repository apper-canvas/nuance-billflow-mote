import customersData from '../mockData/customers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let customers = [...customersData];

const customerService = {
  async getAll() {
    await delay(300);
    return [...customers];
  },

  async getById(id) {
    await delay(200);
    const customer = customers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  },

  async create(customerData) {
    await delay(400);
    const newCustomer = {
      ...customerData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    return { ...newCustomer };
  },

  async update(id, customerData) {
    await delay(350);
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    customers[index] = {
      ...customers[index],
      ...customerData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...customers[index] };
  },

  async delete(id) {
    await delay(250);
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    customers.splice(index, 1);
    return { success: true };
  }
};

export default customerService;