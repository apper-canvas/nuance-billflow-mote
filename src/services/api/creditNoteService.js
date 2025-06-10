import creditNotesData from '../mockData/creditNotes.json';

// Create a copy of the data to simulate database
const creditNotes = [...creditNotesData];

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate unique credit note number
function generateCreditNoteNumber() {
  const year = new Date().getFullYear();
  const count = creditNotes.length + 1;
  return `CN-${year}-${count.toString().padStart(3, '0')}`;
}

const creditNoteService = {
  async getAll() {
    await delay(300);
    return [...creditNotes];
  },

  async getById(id) {
    await delay(200);
    const creditNote = creditNotes.find(cn => cn.id === id);
    if (!creditNote) {
      throw new Error('Credit note not found');
    }
    return { ...creditNote };
  },

  async create(creditNoteData) {
    await delay(400);
    
    const newCreditNote = {
      id: `cn_${Date.now()}`,
      creditNoteNumber: generateCreditNoteNumber(),
      ...creditNoteData,
      status: 'Open',
      appliedToInvoice: false,
      createdBy: 'current_user', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    creditNotes.push(newCreditNote);
    return { ...newCreditNote };
  },

  async update(id, creditNoteData) {
    await delay(400);
    const index = creditNotes.findIndex(cn => cn.id === id);
    if (index === -1) {
      throw new Error('Credit note not found');
    }
    
    creditNotes[index] = {
      ...creditNotes[index],
      ...creditNoteData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...creditNotes[index] };
  },

  async delete(id) {
    await delay(300);
    const index = creditNotes.findIndex(cn => cn.id === id);
    if (index === -1) {
      throw new Error('Credit note not found');
    }
    
    creditNotes.splice(index, 1);
    return { success: true };
  },

  async voidCreditNote(id, reason = '') {
    await delay(300);
    const index = creditNotes.findIndex(cn => cn.id === id);
    if (index === -1) {
      throw new Error('Credit note not found');
    }
    
    if (creditNotes[index].status === 'Applied') {
      throw new Error('Cannot void a credit note that has been applied to an invoice');
    }
    
    creditNotes[index] = {
      ...creditNotes[index],
      status: 'Voided',
      voidReason: reason,
      voidedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { ...creditNotes[index] };
  },

  async applyToInvoice(creditNoteId, invoiceId) {
    await delay(400);
    const index = creditNotes.findIndex(cn => cn.id === creditNoteId);
    if (index === -1) {
      throw new Error('Credit note not found');
    }
    
    if (creditNotes[index].status !== 'Open') {
      throw new Error('Only open credit notes can be applied to invoices');
    }
    
    creditNotes[index] = {
      ...creditNotes[index],
      status: 'Applied',
      appliedToInvoice: true,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { ...creditNotes[index] };
  },

  async generatePDF(id) {
    await delay(1000); // Simulate PDF generation time
    const creditNote = creditNotes.find(cn => cn.id === id);
    if (!creditNote) {
      throw new Error('Credit note not found');
    }
    
    // In a real application, this would use jsPDF to generate actual PDF
    // For now, we'll simulate the download
    return {
      success: true,
      filename: `${creditNote.creditNoteNumber}.pdf`,
      message: 'PDF generated successfully'
    };
  },

  async getByCustomerId(customerId) {
    await delay(200);
    return creditNotes.filter(cn => cn.customerId === customerId);
  },

  async getByInvoiceId(invoiceId) {
    await delay(200);
    return creditNotes.filter(cn => cn.invoiceId === invoiceId);
  },

  async search(query) {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return creditNotes.filter(cn => 
      cn.creditNoteNumber.toLowerCase().includes(lowercaseQuery) ||
      cn.customerName.toLowerCase().includes(lowercaseQuery) ||
      cn.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
      cn.description.toLowerCase().includes(lowercaseQuery)
    );
  }
};

export default creditNoteService;