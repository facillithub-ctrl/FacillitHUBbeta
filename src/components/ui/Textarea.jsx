import React from 'react';

const Textarea = ({ id, label, placeholder, value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
      />
    </div>
  );
};

export default Textarea;