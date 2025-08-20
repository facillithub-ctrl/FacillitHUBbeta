import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, icon, text, isOpen }) => (
  <NavLink 
    to={to} 
    end
    className={({ isActive }) => 
      `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-brand-teal text-white' 
          : 'text-gray-300 hover:bg-brand-cyan hover:text-white'
      }`
    }
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className={`ml-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {text}
    </span>
  </NavLink>
);

const ProfessorSidebar = ({ isOpen }) => {
  return (
    <aside 
      className={`bg-brand-dark-blue text-white flex-shrink-0 p-4 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="text-2xl font-bold mb-10 text-center">
        {isOpen ? 'Facillit Hub' : 'F H'}
      </div>
      <nav>
        {/* Links específicos do Professor */}
        <SidebarLink to="/dashboard/professor" icon="group" text="Minhas Turmas" isOpen={isOpen} />
        <SidebarLink to="/dashboard/professor/notas" icon="grade" text="Lançar Notas" isOpen={isOpen} />
        <SidebarLink to="/dashboard/professor/frequencia" icon="event_available" text="Frequência" isOpen={isOpen} />
      </nav>
    </aside>
  );
};

export default ProfessorSidebar;