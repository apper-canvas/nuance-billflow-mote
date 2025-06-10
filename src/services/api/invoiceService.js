import invoicesData from '../mockData/invoices.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let invoices = [...invoicesData];

const invoiceService = {
  async getAll() {
    await delay(350);
    return [...invoices];
  },

  async getById(id) {
    await delay(200);
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return { ...invoice };
  },

  async create(invoiceData) {
    await delay(500);
    const newInvoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    invoices.push(newInvoice);
    return { ...newInvoice };
  },

  async update(id, invoiceData) {
    await delay(400);
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    invoices[index] = {
      ...invoices[index],
      ...invoiceData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...invoices[index] };
  },

  async delete(id) {
    await delay(300);
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    invoices.splice(index, 1);
    return { success: true };
  }
};

export default invoiceService;