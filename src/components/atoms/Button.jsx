import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', type = 'button', onClick, whileHover, whileTap, ...rest }) => {
  const hasMotion = whileHover || whileTap;
  const Component = hasMotion ? motion.button : 'button';
  
  // Filter out motion-specific props for regular button elements
  const motionProps = hasMotion ? { whileHover, whileTap } : {};
  
  return (
    <Component
      type={type}
      onClick={onClick}
      className={`${className}`}
      {...motionProps}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Button;