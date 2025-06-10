import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, id, type = 'text', children, selectOptions, ...inputProps }) => {
  const InputComponent = type === 'select' ? Select : Input;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <InputComponent id={id} type={type} {...inputProps}>
        {type === 'select' && children}
        {type === 'select' && selectOptions && selectOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </InputComponent>
    </div>
  );
};

export default FormField;