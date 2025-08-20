import React from 'react';
import { NavLink } from 'react-router-dom';

const StudentSidebarLink = ({ to, icon, text }) => (
    <NavLink to={to} end className={({ isActive }) => `flex items-center p-3 my-2 rounded-lg transition-colors text-md font-medium ${isActive ? 'bg-white/70 text-brand-dark-blue shadow-sm' : 'text-gray-700 hover:bg-white/40'}`}>
        <span className="material-symbols-outlined text-brand-cyan">{icon}</span>
        <span className="ml-4">{text}</span>
    </NavLink>
);

const StudentSidebar = () => {
    return (
        <aside className="w-64 bg-teal-50 flex-shrink-0 p-4 border-r">
            <div className="text-2xl font-bold text-brand-dark-blue mb-10">Facillit Hub</div>
            <nav>
                <StudentSidebarLink to="/dashboard/aluno" icon="home" text="Meu Dia" />
                <StudentSidebarLink to="/dashboard/aluno/edu" icon="school" text="Facillit Edu" />
                <StudentSidebarLink to="/dashboard/aluno/games" icon="joystick" text="Facillit Games" />
            </nav>
        </aside>
    );
};

export default StudentSidebar;