import React from 'react';
import { motion } from 'framer-motion';

const Panel = ({ children, className = '', motionProps, ...rest }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg p-6 shadow-sm border border-surface-200 ${className}`}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Panel;