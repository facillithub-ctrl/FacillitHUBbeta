import React from 'react';

const Card = ({ children }) => {
  return (
    // Adicionamos 'min-h-[480px]' para uma altura mínima e 'flex flex-col justify-center' para centralizar o conteúdo verticalmente
    <div className="w-full max-w-lg bg-brand-white rounded-2xl shadow-2xl p-12 flex flex-col justify-center min-h-[480px]">
      {children}
    </div>
  );
};

export default Card;