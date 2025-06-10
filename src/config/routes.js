import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import CustomersPage from '@/components/pages/CustomersPage';
import ProductsPage from '@/components/pages/ProductsPage';
import SubscriptionsPage from '@/components/pages/SubscriptionsPage';
import InvoicesPage from '@/components/pages/InvoicesPage';
import PaymentsPage from '@/components/pages/PaymentsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
component: CustomersPage
  },
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
component: ProductsPage
  },
  subscriptions: {
    id: 'subscriptions',
    label: 'Subscriptions',
    path: '/subscriptions',
    icon: 'Repeat',
component: SubscriptionsPage
  },
  invoices: {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: 'FileText',
component: InvoicesPage
  },
  payments: {
    id: 'payments',
    label: 'Payments',
    path: '/payments',
    icon: 'CreditCard',
component: PaymentsPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
};

export const routeArray = Object.values(routes);