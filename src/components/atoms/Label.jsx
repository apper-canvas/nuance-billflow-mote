import React from 'react';

const Label = ({ children, htmlFor, className = '', ...rest }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-surface-700 mb-1 ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;