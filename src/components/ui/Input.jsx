import React from 'react';

const Input = ({ id, label, type = 'text', placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
        />
      </div>
    </div>
  );
};

export default Input;