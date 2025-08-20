import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="w-full max-w-md bg-brand-white rounded-2xl shadow-2xl p-8 space-y-6">
      {children}
    </div>
  );
};

export default Card;