import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CompanySettingsSection from '@/components/organisms/CompanySettingsSection';
import TaxSettingsSection from '@/components/organisms/TaxSettingsSection';
import InvoiceSettingsSection from '@/components/organisms/InvoiceSettingsSection';
import NotificationSettingsSection from '@/components/organisms/NotificationSettingsSection';

const SettingsPage = () => {
  const [companySettings, setCompanySettings] = useState({
    name: 'BillFlow Pro',
    email: 'billing@billflowpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 0.08,
    taxLabel: 'Sales Tax',
    includeInPrice: false
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV-',
    paymentTerms: 30,
    lateFeesEnabled: false,
    lateFeePercentage: 2.5,
    reminderDays: 7
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    paymentConfirmations: true,
    overdueNotices: true
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-600 mt-1">Configure your billing system preferences</p>
      </div>

      <div className="space-y-8 max-w-4xl">
        <CompanySettingsSection 
          settings={companySettings} 
          onSettingsChange={setCompanySettings} 
        />
        <TaxSettingsSection 
          settings={taxSettings} 
          onSettingsChange={setTaxSettings} 
        />
        <InvoiceSettingsSection 
          settings={invoiceSettings} 
          onSettingsChange={setInvoiceSettings} 
        />
        <NotificationSettingsSection 
          settings={notificationSettings} 
          onSettingsChange={setNotificationSettings} 
        />
      </div>
    </motion.div>
  );
};

export default SettingsPage;