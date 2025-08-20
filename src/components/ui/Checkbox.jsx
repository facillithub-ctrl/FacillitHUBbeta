import React from 'react';

const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
      />
      <label htmlFor={id} className="ml-3 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;