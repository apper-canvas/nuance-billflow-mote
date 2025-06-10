import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CreditNoteForm from '@/components/organisms/CreditNoteForm';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import StatusBadge from '@/components/atoms/StatusBadge';
import ReportTable from '@/components/molecules/ReportTable';
import { creditNoteService, customerService, invoiceService } from '@/services';

const CreditNotesPage = () => {
  const [creditNotes, setCreditNotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [creditNotesData, customersData] = await Promise.all([
        creditNoteService.getAll(),
        customerService.getAll()
      ]);
      setCreditNotes(creditNotesData);
      setCustomers(customersData);
    } catch (error) {
      toast.error('Failed to load credit notes');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setSelectedCreditNote(null);
    setShowForm(true);
  }

  function handleEdit(creditNote) {
    setSelectedCreditNote(creditNote);
    setShowForm(true);
  }

  async function handleVoid(id) {
    if (!confirm('Are you sure you want to void this credit note? This action cannot be undone.')) {
      return;
    }

    try {
      const reason = prompt('Please provide a reason for voiding this credit note:');
      if (reason === null) return; // User cancelled

      await creditNoteService.voidCreditNote(id, reason);
      toast.success('Credit note voided successfully');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to void credit note');
      console.error('Error voiding credit note:', error);
    }
  }

  async function handleApplyToInvoice(creditNote) {
    if (!confirm(`Apply credit note ${creditNote.creditNoteNumber} (${creditNote.amount}) to invoice ${creditNote.invoiceNumber}?`)) {
      return;
    }

    try {
      // Apply credit note
      await creditNoteService.applyToInvoice(creditNote.id, creditNote.invoiceId);
      
      // Update invoice with credit note
      await invoiceService.applyCreditNote(creditNote.invoiceId, creditNote.amount, creditNote.id);
      
      toast.success('Credit note applied to invoice successfully');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to apply credit note');
      console.error('Error applying credit note:', error);
    }
  }

  async function handleGeneratePDF(creditNote) {
    try {
      setGeneratingPDF(creditNote.id);
      const result = await creditNoteService.generatePDF(creditNote.id);
      
      // Simulate PDF download
      const blob = new Blob(['Credit Note PDF Content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF generated and downloaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to generate PDF');
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(null);
    }
  }

  function handleFormSave() {
    setShowForm(false);
    setSelectedCreditNote(null);
    loadData();
  }

  function handleFormCancel() {
    setShowForm(false);
    setSelectedCreditNote(null);
  }

  const filteredCreditNotes = creditNotes.filter(creditNote => {
    const customer = customers.find(c => c.id === creditNote.customerId);
    const matchesSearch = searchTerm === '' || 
      creditNote.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creditNote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creditNote.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creditNote.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || creditNote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilterOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Voided', label: 'Voided' }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Open': return 'warning';
      case 'Applied': return 'success';
      case 'Voided': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'creditNoteNumber',
      header: 'Credit Note #',
      render: (value) => (
        <span className="font-medium text-surface-900">{value}</span>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (value) => (
        <span className="text-surface-700">{value}</span>
      )
    },
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (value) => (
        <span className="font-medium text-surface-600">{value}</span>
      )
    },
    {
      key: 'creditNoteDate',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => (
        <span className="font-medium text-surface-900">${value.toFixed(2)}</span>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (value) => (
        <span className="text-surface-600">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <StatusBadge variant={getStatusVariant(value)}>
          {value}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, creditNote) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(creditNote)}
            className="text-surface-600 hover:text-primary"
          >
            <ApperIcon name="Eye" size={16} />
          </Button>
          
          {creditNote.status === 'Open' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApplyToInvoice(creditNote)}
              className="text-green-600 hover:text-green-700"
              title="Apply to Invoice"
            >
              <ApperIcon name="Check" size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGeneratePDF(creditNote)}
            disabled={generatingPDF === creditNote.id}
            className="text-blue-600 hover:text-blue-700"
            title="Generate PDF"
          >
            {generatingPDF === creditNote.id ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Download" size={16} />
            )}
          </Button>
          
          {creditNote.status !== 'Voided' && creditNote.status !== 'Applied' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVoid(creditNote.id)}
              className="text-red-600 hover:text-red-700"
              title="Void Credit Note"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ApperIcon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {showForm ? (
          <CreditNoteForm
            key="form"
            creditNote={selectedCreditNote}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-surface-900">Credit Notes</h1>
                <p className="text-surface-600 mt-1">
                  Manage credit notes for refunds and adjustments
                </p>
              </div>
              <Button onClick={handleCreate} className="shrink-0">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Credit Note
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search credit notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="sm:w-48">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusFilterOptions}
                />
              </div>
            </div>

            {/* Credit Notes Table */}
            <ReportTable
              title={`Credit Notes (${filteredCreditNotes.length})`}
              data={filteredCreditNotes}
              columns={columns}
            />

            {/* Summary Cards */}
            {creditNotes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-surface-200">
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">Total Credit Notes</h3>
                  <p className="text-3xl font-bold text-primary">{creditNotes.length}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-surface-200">
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">Total Amount</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${creditNotes.reduce((sum, cn) => sum + cn.amount, 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-surface-200">
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">Open Credits</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    ${creditNotes
                      .filter(cn => cn.status === 'Open')
                      .reduce((sum, cn) => sum + cn.amount, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreditNotesPage;