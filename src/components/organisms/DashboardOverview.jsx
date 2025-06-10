import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MetricCard from '@/components/molecules/MetricCard';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import RecentActivityList from '@/components/organisms/RecentActivityList';
import CustomerForm from '@/components/organisms/CustomerForm';
import { customerService, subscriptionService, invoiceService } from '@/services';
const DashboardOverview = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    mrr: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    totalCustomers: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [customers, subscriptions, invoices] = await Promise.all([
        customerService.getAll(),
        subscriptionService.getAll(),
        invoiceService.getAll()
      ]);

      // Calculate MRR from active subscriptions
      const activeSubs = subscriptions.filter(sub => sub.status === 'active');
      const mrr = activeSubs.reduce((total, sub) => {
        const monthlyAmount = sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount;
        return total + monthlyAmount;
      }, 0);

      // Calculate pending payments
      const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
      const pendingPayments = pendingInvoices.reduce((total, inv) => total + inv.total, 0);

      setMetrics({
        mrr: mrr,
        activeSubscriptions: activeSubs.length,
        pendingPayments: pendingPayments,
        totalCustomers: customers.length
      });

      // Generate recent activities
      const recentActivities = [
        {
          message: `${customers.length} customers registered`,
          time: '2 hours ago',
          icon: 'UserPlus',
          color: 'primary'
        },
        {
          message: `${activeSubs.length} active subscriptions`,
          time: '4 hours ago',
          icon: 'Repeat',
          color: 'accent'
        },
        {
          message: `${pendingInvoices.length} invoices pending`,
          time: '6 hours ago',
          icon: 'FileText',
          color: 'secondary'
        }
      ];

      setActivities(recentActivities);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCustomerFormSave = () => {
    setShowCustomerForm(false);
    loadDashboardData(); // Refresh dashboard data after customer creation
    toast.success('Customer created successfully!');
  };

  const handleCustomerFormCancel = () => {
    setShowCustomerForm(false);
  };

const quickActions = [
    {
      title: 'Add Customer',
      description: 'Create a new customer profile',
      icon: 'UserPlus',
      color: 'primary',
      onClick: () => setShowCustomerForm(true)
    },
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: 'FileText',
      color: 'secondary',
      onClick: () => toast.info('Navigate to Invoices page to create new invoice')
    },
    {
      title: 'Record Payment',
      description: 'Log a payment received',
      icon: 'CreditCard',
      color: 'accent',
      onClick: () => toast.info('Navigate to Payments page to record payment')
    },
    {
      title: 'New Subscription',
      description: 'Set up recurring billing',
      icon: 'Repeat',
      color: 'primary',
      onClick: () => toast.info('Navigate to Subscriptions page to create subscription')
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${metrics.mrr.toLocaleString()}`}
          icon="DollarSign"
          change={12.5}
          color="accent"
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          icon="Repeat"
          change={8.2}
          color="primary"
        />
        <MetricCard
          title="Pending Payments"
          value={`$${metrics.pendingPayments.toLocaleString()}`}
          icon="Clock"
          change={-2.1}
          color="secondary"
        />
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers}
          icon="Users"
          change={15.3}
          color="primary"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-lg font-semibold text-surface-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <QuickActionCard {...action} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <RecentActivityList activities={activities} />
</div>
      </div>

      <AnimatePresence>
        {showCustomerForm && (
          <CustomerForm
            customer={null}
            onSave={handleCustomerFormSave}
            onCancel={handleCustomerFormCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardOverview;