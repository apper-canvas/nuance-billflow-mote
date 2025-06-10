import React from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SettingSectionCard from '@/components/molecules/SettingSectionCard';

const NotificationSettingsSection = ({ settings, onSettingsChange }) => {
  const handleSave = () => {
    toast.success('Notification settings saved successfully');
  };

  const NotificationToggle = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-surface-900">{label}</p>
        <p className="text-sm text-surface-600">{description}</p>
      </div>
      <Input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );

  return (
    <SettingSectionCard
      title="Notification Settings"
      description="Configure email notifications and reminders"
    >
      <div className="space-y-4">
        <NotificationToggle
          id="emailNotifications"
          label="Email Notifications"
          description="Receive email notifications for important events"
          checked={settings.emailNotifications}
          onChange={(e) => onSettingsChange({ ...settings, emailNotifications: e.target.checked })}
        />
        <NotificationToggle
          id="invoiceReminders"
          label="Invoice Reminders"
          description="Send automatic reminders for overdue invoices"
          checked={settings.invoiceReminders}
          onChange={(e) => onSettingsChange({ ...settings, invoiceReminders: e.target.checked })}
        />
        <NotificationToggle
          id="paymentConfirmations"
          label="Payment Confirmations"
          description="Send confirmations when payments are received"
          checked={settings.paymentConfirmations}
          onChange={(e) => onSettingsChange({ ...settings, paymentConfirmations: e.target.checked })}
        />
        <NotificationToggle
          id="overdueNotices"
          label="Overdue Notices"
          description="Automatically send overdue payment notices"
          checked={settings.overdueNotices}
          onChange={(e) => onSettingsChange({ ...settings, overdueNotices: e.target.checked })}
        />
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Notification Settings
        </Button>
      </div>
    </SettingSectionCard>
  );
};

export default NotificationSettingsSection;