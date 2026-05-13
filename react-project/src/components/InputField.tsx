import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <input 
      type={type} 
      className="form-control form-control-lg" 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);