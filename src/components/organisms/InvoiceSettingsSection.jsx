import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import SettingSectionCard from '@/components/molecules/SettingSectionCard';

const InvoiceSettingsSection = ({ settings, onSettingsChange }) => {
  const handleSave = () => {
    toast.success('Invoice settings saved successfully');
  };

  return (
    <SettingSectionCard
      title="Invoice Settings"
      description="Configure invoice numbering, payment terms, and late fees"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Invoice Number Prefix"
          id="invoicePrefix"
          type="text"
          value={settings.invoicePrefix}
          onChange={(e) => onSettingsChange({ ...settings, invoicePrefix: e.target.value })}
        />
        <FormField
          label="Default Payment Terms (days)"
          id="paymentTerms"
          type="number"
          min="1"
          value={settings.paymentTerms}
          onChange={(e) => onSettingsChange({ ...settings, paymentTerms: parseInt(e.target.value) || 0 })}
        />
        <FormField
          label="Late Fee Percentage (%)"
          id="lateFeePercentage"
          type="number"
          step="0.1"
          min="0"
          value={settings.lateFeePercentage}
          onChange={(e) => onSettingsChange({ ...settings, lateFeePercentage: parseFloat(e.target.value) || 0 })}
        />
        <FormField
          label="Reminder Days Before Due"
          id="reminderDays"
          type="number"
          min="1"
          value={settings.reminderDays}
          onChange={(e) => onSettingsChange({ ...settings, reminderDays: parseInt(e.target.value) || 0 })}
        />
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <Input
            type="checkbox"
            id="lateFeesEnabled"
            checked={settings.lateFeesEnabled}
            onChange={(e) => onSettingsChange({ ...settings, lateFeesEnabled: e.target.checked })}
          />
          <Label htmlFor="lateFeesEnabled" className="ml-2 mb-0">
            Enable automatic late fees
          </Label>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Invoice Settings
        </Button>
      </div>
    </SettingSectionCard>
  );
};

export default InvoiceSettingsSection;