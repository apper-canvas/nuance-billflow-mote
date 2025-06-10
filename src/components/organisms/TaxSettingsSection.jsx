import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import SettingSectionCard from '@/components/molecules/SettingSectionCard';

const TaxSettingsSection = ({ settings, onSettingsChange }) => {
  const handleSave = () => {
    toast.success('Tax settings saved successfully');
  };

  return (
    <SettingSectionCard
      title="Tax Configuration"
      description="Set up default tax rates and tax calculation preferences"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Default Tax Rate (%)"
          id="defaultTaxRate"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={settings.defaultTaxRate * 100}
          onChange={(e) => onSettingsChange({ 
            ...settings, 
            defaultTaxRate: parseFloat(e.target.value) / 100 
          })}
        />
        <FormField
          label="Tax Label"
          id="taxLabel"
          type="text"
          value={settings.taxLabel}
          onChange={(e) => onSettingsChange({ ...settings, taxLabel: e.target.value })}
        />
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <Input
            type="checkbox"
            id="includeInPrice"
            checked={settings.includeInPrice}
            onChange={(e) => onSettingsChange({ ...settings, includeInPrice: e.target.checked })}
          />
          <Label htmlFor="includeInPrice" className="ml-2 mb-0">
            Include tax in product prices
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
          Save Tax Settings
        </Button>
      </div>
    </SettingSectionCard>
  );
};

export default TaxSettingsSection;