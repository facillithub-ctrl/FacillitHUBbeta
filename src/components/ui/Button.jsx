import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', iconLeft = null, fullWidth = false }) => {
  const baseStyle = `flex items-center justify-center px-6 py-2.5 font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`;
  
  const variants = {
    primary: 'bg-gradient-primary text-brand-white focus:ring-brand-teal',
    secondary: 'bg-brand-white text-brand-cyan border border-brand-cyan focus:ring-brand-cyan',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${width}`}
    >
      {iconLeft && <span className="material-symbols-outlined mr-2">{iconLeft}</span>}
      {children}
    </button>
  );
};

export default Button;