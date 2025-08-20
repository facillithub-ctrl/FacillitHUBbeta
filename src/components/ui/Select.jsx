import React from 'react';

const Select = ({ id, label, value, onChange, children }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;