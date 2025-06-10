import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { creditNoteService, customerService, invoiceService } from '@/services';

const CreditNoteForm = ({ creditNote, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    invoiceId: '',
    invoiceNumber: '',
    creditNoteDate: new Date().toISOString().split('T')[0],
    reason: '',
    amount: '',
    description: '',
    attachments: []
  });
  
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const reasonOptions = [
    { value: '', label: 'Select a reason' },
    { value: 'Refund', label: 'Refund' },
    { value: 'Adjustment', label: 'Price Adjustment' },
    { value: 'Discount', label: 'Additional Discount' },
    { value: 'Billing Error', label: 'Billing Error' },
    { value: 'Return', label: 'Product Return' },
    { value: 'Damaged Goods', label: 'Damaged Goods' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (creditNote) {
      setFormData({
        customerId: creditNote.customerId || '',
        customerName: creditNote.customerName || '',
        invoiceId: creditNote.invoiceId || '',
        invoiceNumber: creditNote.invoiceNumber || '',
        creditNoteDate: creditNote.creditNoteDate || new Date().toISOString().split('T')[0],
        reason: creditNote.reason || '',
        amount: creditNote.amount?.toString() || '',
        description: creditNote.description || '',
        attachments: creditNote.attachments || []
      });
    }
  }, [creditNote]);

  useEffect(() => {
    if (formData.customerId) {
      const customerInvoices = invoices.filter(inv => inv.customerId === formData.customerId);
      setFilteredInvoices(customerInvoices);
      
      // Reset invoice selection if current invoice doesn't belong to selected customer
      if (formData.invoiceId && !customerInvoices.find(inv => inv.id === formData.invoiceId)) {
        setFormData(prev => ({ ...prev, invoiceId: '', invoiceNumber: '' }));
      }
    } else {
      setFilteredInvoices([]);
    }
  }, [formData.customerId, invoices]);

  async function loadData() {
    try {
      setLoading(true);
      const [customersData, invoicesData] = await Promise.all([
        customerService.getAll(),
        invoiceService.getAll()
      ]);
      setCustomers(customersData);
      setInvoices(invoicesData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.invoiceId) {
      newErrors.invoiceId = 'Invoice is required';
    }

    if (!formData.creditNoteDate) {
      newErrors.creditNoteDate = 'Credit note date is required';
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate amount against invoice total
    if (formData.invoiceId && formData.amount) {
      const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);
      if (selectedInvoice) {
        const invoiceTotal = selectedInvoice.amountDue || selectedInvoice.total;
        if (parseFloat(formData.amount) > invoiceTotal) {
          newErrors.amount = `Amount cannot exceed invoice total of $${invoiceTotal}`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle customer selection
    if (field === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customerId: value,
          customerName: selectedCustomer.name,
          invoiceId: '',
          invoiceNumber: ''
        }));
      }
    }

    // Handle invoice selection
    if (field === 'invoiceId') {
      const selectedInvoice = invoices.find(inv => inv.id === value);
      if (selectedInvoice) {
        setFormData(prev => ({
          ...prev,
          invoiceId: value,
          invoiceNumber: selectedInvoice.number
        }));
      }
    }
  }

  function handleFileAttachment(event) {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file // In real app, this would be uploaded to server
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  }

  function removeAttachment(attachmentId) {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        attachments: formData.attachments.map(att => ({
          id: att.id,
          name: att.name,
          type: att.type,
          size: att.size
        }))
      };

      let result;
      if (creditNote) {
        result = await creditNoteService.update(creditNote.id, submitData);
        toast.success('Credit note updated successfully');
      } else {
        result = await creditNoteService.create(submitData);
        toast.success('Credit note created successfully');
      }

      onSave?.(result);
    } catch (error) {
      toast.error(error.message || 'Failed to save credit note');
      console.error('Error saving credit note:', error);
    } finally {
      setLoading(false);
    }
  }

  const customerOptions = [
    { value: '', label: 'Select a customer' },
    ...customers.map(customer => ({
      value: customer.id,
      label: customer.name
    }))
  ];

  const invoiceOptions = [
    { value: '', label: 'Select an invoice' },
    ...filteredInvoices.map(invoice => ({
      value: invoice.id,
      label: `${invoice.number} - $${invoice.amountDue || invoice.total}`
    }))
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-surface-900">
          {creditNote ? 'Edit Credit Note' : 'Create Credit Note'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-surface-400 hover:text-surface-600"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Customer *"
            id="customerId"
            type="select"
            value={formData.customerId}
            onChange={(value) => handleInputChange('customerId', value)}
            options={customerOptions}
            error={errors.customerId}
            disabled={loading}
          />

          <FormField
            label="Invoice *"
            id="invoiceId"
            type="select"
            value={formData.invoiceId}
            onChange={(value) => handleInputChange('invoiceId', value)}
            options={invoiceOptions}
            error={errors.invoiceId}
            disabled={loading || !formData.customerId}
          />

          <FormField
            label="Credit Note Date *"
            id="creditNoteDate"
            type="date"
            value={formData.creditNoteDate}
            onChange={(value) => handleInputChange('creditNoteDate', value)}
            error={errors.creditNoteDate}
            disabled={loading}
          />

          <FormField
            label="Reason *"
            id="reason"
            type="select"
            value={formData.reason}
            onChange={(value) => handleInputChange('reason', value)}
            options={reasonOptions}
            error={errors.reason}
            disabled={loading}
          />

          <FormField
            label="Amount *"
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(value) => handleInputChange('amount', value)}
            error={errors.amount}
            disabled={loading}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <FormField
          label="Description *"
          id="description"
          type="textarea"
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          error={errors.description}
          disabled={loading}
          rows={4}
          placeholder="Describe the reason for this credit note..."
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-surface-700">
            Attachments (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              onChange={handleFileAttachment}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload').click()}
              disabled={loading}
            >
              <ApperIcon name="Paperclip" size={16} className="mr-2" />
              Add Files
            </Button>
            <span className="text-sm text-surface-500">
              PDF, DOC, DOCX, JPG, PNG files only
            </span>
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              {formData.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="File" size={16} className="text-surface-400" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">{attachment.name}</p>
                      <p className="text-xs text-surface-500">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                {creditNote ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              creditNote ? 'Update Credit Note' : 'Create Credit Note'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreditNoteForm;