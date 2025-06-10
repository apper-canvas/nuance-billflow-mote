import React from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import SettingSectionCard from '@/components/molecules/SettingSectionCard';

const CompanySettingsSection = ({ settings, onSettingsChange }) => {
  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Company settings saved successfully');
  };

  return (
    <SettingSectionCard
      title="Company Information"
      description="Update your company details that appear on invoices and communications"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Company Name"
          id="companyName"
          type="text"
          value={settings.name}
          onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
        />
        <FormField
          label="Email Address"
          id="companyEmail"
          type="email"
          value={settings.email}
          onChange={(e) => onSettingsChange({ ...settings, email: e.target.value })}
        />
        <FormField
          label="Phone Number"
          id="companyPhone"
          type="tel"
          value={settings.phone}
          onChange={(e) => onSettingsChange({ ...settings, phone: e.target.value })}
        />
        <FormField
          label="Address"
          id="companyAddress"
          type="text"
          value={settings.address}
          onChange={(e) => onSettingsChange({ ...settings, address: e.target.value })}
        />
        <FormField
          label="City"
          id="companyCity"
          type="text"
          value={settings.city}
          onChange={(e) => onSettingsChange({ ...settings, city: e.target.value })}
        />
        <FormField
          label="State/Province"
          id="companyState"
          type="text"
          value={settings.state}
          onChange={(e) => onSettingsChange({ ...settings, state: e.target.value })}
        />
        <FormField
          label="Zip Code"
          id="companyZipCode"
          type="text"
          value={settings.zipCode}
          onChange={(e) => onSettingsChange({ ...settings, zipCode: e.target.value })}
        />
        <FormField
          label="Country"
          id="companyCountry"
          type="text"
          value={settings.country}
          onChange={(e) => onSettingsChange({ ...settings, country: e.target.value })}
        />
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Company Info
        </Button>
      </div>
    </SettingSectionCard>
  );
};

export default CompanySettingsSection;