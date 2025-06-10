import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Panel from '@/components/atoms/Panel';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Users',
      title: 'Customer Management',
      description: 'Manage customer profiles, contact details, and billing information'
    },
    {
      icon: 'Repeat',
      title: 'Subscription Billing',
      description: 'Automate recurring billing cycles and subscription management'
    },
    {
      icon: 'FileText',
      title: 'Invoice Generation',
      description: 'Create professional invoices with tax calculations'
    },
    {
      icon: 'CreditCard',
      title: 'Payment Tracking',
      description: 'Record and track payments with detailed transaction logs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="DollarSign" className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-4">
            BillFlow Pro
          </h1>
          <p className="text-xl text-surface-600 mb-8 max-w-2xl mx-auto">
            Comprehensive billing and subscription management platform that streamlines your entire revenue lifecycle
          </p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Panel
              key={index}
              motionProps={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.1 }
              }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ApperIcon name={feature.icon} className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
              <p className="text-surface-600">{feature.description}</p>
            </Panel>
          ))}
        </div>

        <Panel
          motionProps={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.5 }
          }}
          className="rounded-xl p-8 shadow-lg"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-surface-900 mb-4">
              Ready to streamline your billing?
            </h2>
            <p className="text-surface-600 mb-6">
              Start managing customers, subscriptions, and payments in one unified platform
            </p>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Access Dashboard
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default HomePage;