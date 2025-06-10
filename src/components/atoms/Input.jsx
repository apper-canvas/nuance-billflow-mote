import React from 'react';

const Input = ({ label, id, className = '', type = 'text', value, onChange, placeholder, required, step, min, max, ...rest }) => {
  const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

  if (type === 'checkbox') {
    return (
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={onChange}
        className={`w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary ${className}`}
        {...rest}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        rows={rest.rows || 3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${className}`}
        {...rest}
      />
    );
  }

  return (
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      className={`${baseClasses} ${className}`}
      {...rest}
    />
  );
};

export default Input;