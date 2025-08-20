import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { profile, signOut } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="flex items-center">
        <span className="mr-4">Olá, {profile?.nickname}!</span>
        <button onClick={signOut} className="font-semibold text-brand-cyan hover:underline">
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;