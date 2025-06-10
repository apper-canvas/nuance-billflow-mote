import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = routeArray.filter(route => route.id !== 'home');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="text-white" size={20} />
              </div>
              <h1 className="ml-3 text-lg font-bold text-surface-900">BillFlow Pro</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <ApperIcon name="Search" className="absolute left-3 top-2.5 text-surface-400" size={18} />
            </div>
            <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg">
              <ApperIcon name="Bell" size={20} />
            </button>
          </div>
        </div>
</header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-3 space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white border-l-4 border-primary'
                        : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={18} className="mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-surface-200 z-50">
<div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="DollarSign" className="text-white" size={20} />
                    </div>
                    <h1 className="ml-3 text-lg font-bold text-surface-900">BillFlow Pro</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-surface-500 hover:text-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white border-l-4 border-primary'
                            : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} size={18} className="mr-3" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-full overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;