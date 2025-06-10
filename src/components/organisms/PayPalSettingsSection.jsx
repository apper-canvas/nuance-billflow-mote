import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SettingSectionCard from '@/components/molecules/SettingSectionCard';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import paypalService from '@/services/api/paypalService';

const PayPalSettingsSection = () => {
  const [settings, setSettings] = useState({
    clientId: '',
    clientSecret: '',
    environment: 'sandbox',
    webhookUrl: '',
    enabled: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isValidating, setValidating] = useState(false);

  useEffect(() => {
    // Load PayPal settings from localStorage or API
    const savedSettings = localStorage.getItem('paypalSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Validate credentials if provided
      if (settings.clientId && settings.clientSecret) {
        setValidating(true);
        const validation = await paypalService.validateCredentials(
          settings.clientId, 
          settings.clientSecret
        );
        
        if (!validation.success) {
          toast.error(validation.error);
          setValidating(false);
          setSaving(false);
          return;
        }
        setValidating(false);
      }

      // Save settings
      localStorage.setItem('paypalSettings', JSON.stringify(settings));
      setIsEditing(false);
      toast.success('PayPal settings saved successfully');
    } catch (error) {
      toast.error('Failed to save PayPal settings');
    } finally {
      setSaving(false);
      setValidating(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings.clientId || !settings.clientSecret) {
      toast.error('Please enter PayPal credentials first');
      return;
    }

    setValidating(true);
    
    try {
      const result = await paypalService.validateCredentials(
        settings.clientId,
        settings.clientSecret
      );
      
      if (result.success) {
        toast.success('PayPal connection successful!');
      } else {
        toast.error(result.error || 'Connection test failed');
      }
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setValidating(false);
    }
  };

  const webhookUrl = `${window.location.origin}/api/webhooks/paypal`;

  return (
    <SettingSectionCard
      title="PayPal Integration"
      description="Configure PayPal payment processing for your application"
      icon="CreditCard"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => {
        setIsEditing(false);
        // Reset to saved settings
        const savedSettings = localStorage.getItem('paypalSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }}
      isSaving={isSaving}
    >
      <div className="space-y-6">
        {/* Status Banner */}
        <div className={`rounded-lg p-4 ${
          settings.enabled && settings.clientId 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <ApperIcon 
              name={settings.enabled && settings.clientId ? "CheckCircle" : "AlertTriangle"} 
              className={settings.enabled && settings.clientId ? "text-green-600" : "text-yellow-600"} 
              size={20} 
            />
            <div className="ml-3">
              <h4 className={`font-medium ${
                settings.enabled && settings.clientId ? 'text-green-800' : 'text-yellow-800'
              }`}>
                PayPal Status: {settings.enabled && settings.clientId ? 'Active' : 'Inactive'}
              </h4>
              <p className={`text-sm ${
                settings.enabled && settings.clientId ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {settings.enabled && settings.clientId 
                  ? 'PayPal payments are enabled and configured'
                  : 'Configure PayPal credentials to enable PayPal payments'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
          <div>
            <h4 className="font-medium text-surface-900">Enable PayPal Payments</h4>
            <p className="text-sm text-surface-600">Allow customers to pay using PayPal</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Environment Selection */}
        <FormField
          label="Environment"
          id="paypal-environment"
          type="select"
          value={settings.environment}
          onChange={(e) => setSettings({ ...settings, environment: e.target.value })}
          disabled={!isEditing}
          selectOptions={[
            { value: 'sandbox', label: 'Sandbox (Testing)' },
            { value: 'live', label: 'Live (Production)' }
          ]}
        />

        {/* API Credentials */}
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="PayPal Client ID"
            id="paypal-client-id"
            type="text"
            value={settings.clientId}
            onChange={(e) => setSettings({ ...settings, clientId: e.target.value })}
            placeholder="Enter your PayPal Client ID"
            disabled={!isEditing}
          />

          <FormField
            label="PayPal Client Secret"
            id="paypal-client-secret"
            type="password"
            value={settings.clientSecret}
            onChange={(e) => setSettings({ ...settings, clientSecret: e.target.value })}
            placeholder="Enter your PayPal Client Secret"
            disabled={!isEditing}
          />
        </div>

        {/* Webhook Configuration */}
        <div className="space-y-4">
          <FormField
            label="Webhook URL"
            id="paypal-webhook-url"
            type="text"
            value={webhookUrl}
            disabled={true}
            help="Copy this URL to your PayPal application webhook settings"
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ApperIcon name="Info" className="text-blue-600 mt-0.5 mr-3" size={16} />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Webhook Setup Instructions</h4>
                <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Log in to your PayPal Developer Dashboard</li>
                  <li>Navigate to your application settings</li>
                  <li>Add the webhook URL above to your webhook endpoints</li>
                  <li>Subscribe to these events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        {isEditing && settings.clientId && settings.clientSecret && (
          <div className="pt-4 border-t border-surface-200">
            <Button
              type="button"
              onClick={handleTestConnection}
              disabled={isValidating}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing Connection...
                </>
              ) : (
                <>
                  <ApperIcon name="Wifi" size={16} className="mr-2" />
                  Test PayPal Connection
                </>
              )}
            </Button>
          </div>
        )}

        {/* PayPal Resources */}
        <div className="bg-surface-50 rounded-lg p-4">
          <h4 className="font-medium text-surface-900 mb-3">PayPal Resources</h4>
          <div className="space-y-2 text-sm">
            <a
              href="https://developer.paypal.com/api/rest/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ApperIcon name="ExternalLink" size={14} className="mr-2" />
              PayPal Developer Documentation
            </a>
            <a
              href="https://developer.paypal.com/developer/applications/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ApperIcon name="ExternalLink" size={14} className="mr-2" />
              Create PayPal Application
            </a>
            <a
              href="https://developer.paypal.com/api/rest/webhooks/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ApperIcon name="ExternalLink" size={14} className="mr-2" />
              Webhook Configuration Guide
            </a>
          </div>
        </div>
      </div>
    </SettingSectionCard>
  );
};

export default PayPalSettingsSection;