import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import CustomersPage from '@/components/pages/CustomersPage';
import InvoicesPage from '@/components/pages/InvoicesPage';
import PaymentsPage from '@/components/pages/PaymentsPage';
import ProductsPage from '@/components/pages/ProductsPage';
import SubscriptionsPage from '@/components/pages/SubscriptionsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import PayPalSuccessPage from '@/components/pages/PayPalSuccessPage';
import PayPalErrorPage from '@/components/pages/PayPalErrorPage';
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
    icon: 'BarChart3',
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

export const additionalRoutes = [
  { path: '/paypal/success', component: PayPalSuccessPage, title: 'Payment Successful' },
  { path: '/paypal/error', component: PayPalErrorPage, title: 'Payment Failed' },
  { path: '*', component: NotFoundPage, title: 'Page Not Found' }
];