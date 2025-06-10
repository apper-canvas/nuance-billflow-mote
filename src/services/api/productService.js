import productsData from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let products = [...productsData];

const productService = {
  async getAll() {
    await delay(250);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  },

  async create(productData) {
    await delay(400);
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(350);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...products[index] };
  },

  async delete(id) {
    await delay(250);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products.splice(index, 1);
    return { success: true };
  }
};

export default productService;