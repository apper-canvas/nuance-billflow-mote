import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const SettingCard = ({ title, description, children }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
      <p className="text-surface-600 text-sm mt-1">{description}</p>
    </div>
    {children}
  </div>
);

const Settings = () => {
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

  const handleSaveCompany = () => {
    // In a real app, this would save to backend
    toast.success('Company settings saved successfully');
  };

  const handleSaveTax = () => {
    toast.success('Tax settings saved successfully');
  };

  const handleSaveInvoice = () => {
    toast.success('Invoice settings saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully');
  };

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
        {/* Company Information */}
        <SettingCard
          title="Company Information"
          description="Update your company details that appear on invoices and communications"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companySettings.name}
                onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={companySettings.city}
                onChange={(e) => setCompanySettings({ ...companySettings, city: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={companySettings.state}
                onChange={(e) => setCompanySettings({ ...companySettings, state: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveCompany}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Company Info
            </motion.button>
          </div>
        </SettingCard>

        {/* Tax Configuration */}
        <SettingCard
          title="Tax Configuration"
          description="Set up default tax rates and tax calculation preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={taxSettings.defaultTaxRate * 100}
                onChange={(e) => setTaxSettings({ 
                  ...taxSettings, 
                  defaultTaxRate: parseFloat(e.target.value) / 100 
                })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Tax Label
              </label>
              <input
                type="text"
                value={taxSettings.taxLabel}
                onChange={(e) => setTaxSettings({ ...taxSettings, taxLabel: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeInPrice"
                checked={taxSettings.includeInPrice}
                onChange={(e) => setTaxSettings({ ...taxSettings, includeInPrice: e.target.checked })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
              <label htmlFor="includeInPrice" className="ml-2 text-sm text-surface-700">
                Include tax in product prices
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveTax}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Tax Settings
            </motion.button>
          </div>
        </SettingCard>

        {/* Invoice Settings */}
        <SettingCard
          title="Invoice Settings"
          description="Configure invoice numbering, payment terms, and late fees"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={invoiceSettings.invoicePrefix}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Default Payment Terms (days)
              </label>
              <input
                type="number"
                min="1"
                value={invoiceSettings.paymentTerms}
                onChange={(e) => setInvoiceSettings({ 
                  ...invoiceSettings, 
                  paymentTerms: parseInt(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Late Fee Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={invoiceSettings.lateFeePercentage}
                onChange={(e) => setInvoiceSettings({ 
                  ...invoiceSettings, 
                  lateFeePercentage: parseFloat(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Reminder Days Before Due
              </label>
              <input
                type="number"
                min="1"
                value={invoiceSettings.reminderDays}
                onChange={(e) => setInvoiceSettings({ 
                  ...invoiceSettings, 
                  reminderDays: parseInt(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lateFeesEnabled"
                checked={invoiceSettings.lateFeesEnabled}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, lateFeesEnabled: e.target.checked })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
              <label htmlFor="lateFeesEnabled" className="ml-2 text-sm text-surface-700">
                Enable automatic late fees
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveInvoice}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Invoice Settings
            </motion.button>
          </div>
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard
          title="Notification Settings"
          description="Configure email notifications and reminders"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Email Notifications</p>
                <p className="text-sm text-surface-600">Receive email notifications for important events</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  emailNotifications: e.target.checked 
                })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Invoice Reminders</p>
                <p className="text-sm text-surface-600">Send automatic reminders for overdue invoices</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.invoiceReminders}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  invoiceReminders: e.target.checked 
                })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Payment Confirmations</p>
                <p className="text-sm text-surface-600">Send confirmations when payments are received</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.paymentConfirmations}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  paymentConfirmations: e.target.checked 
                })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Overdue Notices</p>
                <p className="text-sm text-surface-600">Automatically send overdue payment notices</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.overdueNotices}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  overdueNotices: e.target.checked 
                })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveNotifications}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Notification Settings
            </motion.button>
          </div>
        </SettingCard>
      </div>
    </motion.div>
  );
};

export default Settings;