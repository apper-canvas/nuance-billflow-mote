import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', type = 'button', onClick, whileHover, whileTap, ...rest }) => {
  const Component = whileHover || whileTap ? motion.button : 'button';

  return (
    <Component
      type={type}
      onClick={onClick}
      className={`${className}`}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Button;