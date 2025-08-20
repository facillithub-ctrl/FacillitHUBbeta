import React from 'react';
import { NavLink } from 'react-router-dom';

// O componente de link interno não precisa de alterações
const SidebarLink = ({ to, icon, text, isOpen }) => (
  <NavLink 
    to={to} 
    end={to === "/dashboard/gestor"} // Garante que "Início" só fica ativo na página exata
    className={({ isActive }) => 
      `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-brand-teal text-white' 
          : 'text-gray-300 hover:bg-brand-cyan hover:text-white'
      }`
    }
  >
    <span className="material-symbols-outlined">{icon}</span>
    {/* O texto só será exibido se a sidebar estiver aberta */}
    <span className={`ml-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {text}
    </span>
  </NavLink>
);

const Sidebar = ({ isOpen }) => {
  return (
    // A largura da sidebar agora depende do estado 'isOpen'
    <aside 
      className={`bg-brand-dark-blue text-white flex-shrink-0 p-4 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="text-2xl font-bold mb-10 text-center">
        {/* Mostra 'F H' quando colapsada e 'Facillit Hub' quando aberta */}
        {isOpen ? 'Facillit Hub' : 'F H'}
      </div>
      <nav>
        <SidebarLink to="/dashboard/gestor" icon="home" text="Início" isOpen={isOpen} />
        <SidebarLink to="/dashboard/gestor/edu" icon="school" text="Facillit Edu" isOpen={isOpen} />
      </nav>
    </aside>
  );
};

export default Sidebar;