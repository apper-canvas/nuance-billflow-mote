import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Products from '../pages/Products';
import Subscriptions from '../pages/Subscriptions';
import Invoices from '../pages/Invoices';
import Payments from '../pages/Payments';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  },
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
    component: Products
  },
  subscriptions: {
    id: 'subscriptions',
    label: 'Subscriptions',
    path: '/subscriptions',
    icon: 'Repeat',
    component: Subscriptions
  },
  invoices: {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: 'FileText',
    component: Invoices
  },
  payments: {
    id: 'payments',
    label: 'Payments',
    path: '/payments',
    icon: 'CreditCard',
    component: Payments
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);