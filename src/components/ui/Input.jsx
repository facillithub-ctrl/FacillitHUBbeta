import React from 'react';

const Input = ({ id, label, type = 'text', placeholder, value, onChange, icon = null, disabled = false, onBlur = null }) => {
  const paddingClass = icon ? 'pl-10' : 'px-4';
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="material-symbols-outlined text-gray-400">
            {icon}
          </span>
        </div>
      )}

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-brand-teal focus:border-brand-teal sm:text-sm ${paddingClass} ${disabledClass}`}
      />
    </div>
  );
};

export default Input;