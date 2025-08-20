import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const EduNavLink = ({ to, text }) => (
    <NavLink to={to} end className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-brand-dark-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        {text}
    </NavLink>
);

const FacillitEduLayout = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark-blue">Módulo Facillit Edu</h1>
            <p className="mt-2 text-gray-600">O cérebro da sua gestão escolar.</p>

            <nav className="flex space-x-4 my-8 border-b pb-2">
                <EduNavLink to="/dashboard/gestor/edu" text="Visão Geral" />
                <EduNavLink to="/dashboard/gestor/edu/turmas" text="Gerenciar Turmas" />
                <EduNavLink to="/dashboard/gestor/edu/convites" text="Gerenciar Convites" />
                {/* Adicionar links para Alunos, Professores, etc. aqui */}
            </nav>

            <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
                <Outlet />
            </div>
        </div>
    );
};

export default FacillitEduLayout;