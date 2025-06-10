import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { customerService, subscriptionService, invoiceService, paymentService } from '../services';

const MetricCard = ({ title, value, icon, change, color = "primary" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-surface-600">{title}</p>
        <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <ApperIcon 
              name={change > 0 ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={change > 0 ? "text-accent mr-1" : "text-red-500 mr-1"} 
            />
            <span className={`text-sm ${change > 0 ? "text-accent" : "text-red-500"}`}>
              {Math.abs(change)}% vs last month
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 bg-${color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
        <ApperIcon name={icon} size={24} className={`text-${color}`} />
      </div>
    </div>
  </motion.div>
);

const ReportTable = ({ title, data, columns }) => (
  <div className="bg-white rounded-lg shadow-sm border border-surface-200">
    <div className="p-6 border-b border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-surface-500">No data available</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-surface-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-surface-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

const Reports = () => {
  const [reportData, setReportData] = useState({
    revenue: 0,
    customers: 0,
    subscriptions: 0,
    invoices: 0,
    payments: 0,
    mrr: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customers, subscriptions, invoices, payments] = await Promise.all([
        customerService.getAll(),
        subscriptionService.getAll(),
        invoiceService.getAll(),
        paymentService.getAll()
      ]);

      // Calculate metrics
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
      const mrr = activeSubscriptions.reduce((sum, sub) => {
        const monthlyAmount = sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount;
        return sum + monthlyAmount;
      }, 0);

      setReportData({
        revenue: totalRevenue,
        customers: customers.length,
        subscriptions: activeSubscriptions.length,
        invoices: invoices.length,
        payments: payments.length,
        mrr: mrr
      });

      // Generate revenue data by month (simplified)
      const monthlyRevenue = payments.reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        acc[month] = (acc[month] || 0) + payment.amount;
        return acc;
      }, {});

      const revenueDataArray = Object.entries(monthlyRevenue).map(([month, amount]) => ({
        month,
        amount: amount.toFixed(2)
      }));

      setRevenueData(revenueDataArray.slice(-6)); // Last 6 months

      // Top customers by total payments
      const customerPayments = customers.map(customer => {
        const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
        const customerTotal = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
        return {
          name: customer.name,
          email: customer.email,
          total: customerTotal,
          invoices: customerInvoices.length
        };
      }).filter(c => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);

      setTopCustomers(customerPayments);

      // Recent invoices with customer info
      const recentInvoicesWithCustomers = invoices
        .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
        .slice(0, 10)
        .map(invoice => {
          const customer = customers.find(c => c.id === invoice.customerId);
          return {
            id: invoice.id.slice(-6),
            customer: customer?.name || 'Unknown',
            amount: invoice.total,
            status: invoice.status,
            dueDate: new Date(invoice.dueDate).toLocaleDateString()
          };
        });

      setRecentInvoices(recentInvoicesWithCustomers);

    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const revenueColumns = [
    { key: 'month', header: 'Month' },
    { 
      key: 'amount', 
      header: 'Revenue', 
      render: (value) => `$${parseFloat(value).toLocaleString()}`
    }
  ];

  const customerColumns = [
    { key: 'name', header: 'Customer' },
    { key: 'email', header: 'Email' },
    { 
      key: 'total', 
      header: 'Total Revenue', 
      render: (value) => `$${value.toFixed(2)}`
    },
    { key: 'invoices', header: 'Invoices' }
  ];

  const invoiceColumns = [
    { key: 'id', header: 'Invoice #' },
    { key: 'customer', header: 'Customer' },
    { 
      key: 'amount', 
      header: 'Amount', 
      render: (value) => `$${value.toFixed(2)}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'paid' ? 'bg-accent/10 text-accent' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'dueDate', header: 'Due Date' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Reports</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadReportData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-full overflow-hidden"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Reports</h1>
        <p className="text-surface-600 mt-1">Financial insights and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`$${reportData.revenue.toLocaleString()}`}
          icon="DollarSign"
          change={15.3}
          color="accent"
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={`$${reportData.mrr.toLocaleString()}`}
          icon="Repeat"
          change={8.7}
          color="primary"
        />
        <MetricCard
          title="Total Customers"
          value={reportData.customers}
          icon="Users"
          change={12.1}
          color="secondary"
        />
        <MetricCard
          title="Active Subscriptions"
          value={reportData.subscriptions}
          icon="Calendar"
          change={5.8}
          color="primary"
        />
        <MetricCard
          title="Total Invoices"
          value={reportData.invoices}
          icon="FileText"
          change={-2.3}
          color="secondary"
        />
        <MetricCard
          title="Payments Received"
          value={reportData.payments}
          icon="CreditCard"
          change={18.9}
          color="accent"
        />
      </div>

      {/* Reports Tables */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReportTable
            title="Revenue by Month"
            data={revenueData}
            columns={revenueColumns}
          />
          <ReportTable
            title="Top Customers"
            data={topCustomers}
            columns={customerColumns}
          />
        </div>
        
        <ReportTable
          title="Recent Invoices"
          data={recentInvoices}
          columns={invoiceColumns}
        />
      </div>
    </motion.div>
  );
};

export default Reports;