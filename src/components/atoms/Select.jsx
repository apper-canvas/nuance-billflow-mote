import React from 'react';

const Select = ({ children, className = '', value, onChange, required, ...rest }) => {
  return (
    <select
      required={required}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
};

export default Select;