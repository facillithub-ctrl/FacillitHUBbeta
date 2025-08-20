import React from 'react';
import { NavLink } from 'react-router-dom';

const StudentSidebarLink = ({ to, icon, text }) => (
    <NavLink to={to} className={({ isActive }) => `flex items-center p-3 my-2 rounded-full transition-colors text-lg ${isActive ? 'bg-white text-brand-dark-blue font-bold shadow-md' : 'text-gray-700 hover:bg-white/50'}`}>
        <span className="material-symbols-outlined">{icon}</span>
        <span className="ml-4">{text}</span>
    </NavLink>
);

const StudentSidebar = () => {
    return (
        <aside className="w-64 bg-brand-cyan/20 p-4">
            <div className="text-2xl font-bold text-brand-dark-blue mb-10">Facillit Hub</div>
            <nav>
                <StudentSidebarLink to="/dashboard/aluno" icon="home" text="Meu Dia" />
                <StudentSidebarLink to="/dashboard/aluno/edu" icon="school" text="Facillit Edu" />
                <StudentSidebarLink to="/dashboard/aluno/games" icon="joystick" text="Facillit Games" />
                {/* Outros módulos lúdicos aqui */}
            </nav>
        </aside>
    );
};

export default StudentSidebar;