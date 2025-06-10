import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Panel from '@/components/atoms/Panel';
import CompanySettingsSection from '@/components/organisms/CompanySettingsSection';
import TaxSettingsSection from '@/components/organisms/TaxSettingsSection';
import InvoiceSettingsSection from '@/components/organisms/InvoiceSettingsSection';
import NotificationSettingsSection from '@/components/organisms/NotificationSettingsSection';
import PayPalSettingsSection from '@/components/organisms/PayPalSettingsSection';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company', icon: 'Building' },
{ id: 'tax', label: 'Tax Settings', icon: 'Calculator' },
    { id: 'invoice', label: 'Invoice Settings', icon: 'FileText' },
    { id: 'payments', label: 'Payment Methods', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

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

  const [companySettings, setCompanySettings] = useState({
    companyName: '',
    address: '',
    email: '',
    phone: '',
    website: ''
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
        <PayPalSettingsSection />
      </div>
    </motion.div>
  );
};

export default SettingsPage;