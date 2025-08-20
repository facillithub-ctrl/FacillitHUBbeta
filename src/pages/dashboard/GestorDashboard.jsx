import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GestorDashboard = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark-blue">Dashboard do Gestor</h1>
        <button onClick={signOut} className="font-semibold text-brand-cyan hover:underline">
          Sair
        </button>
      </header>
      <main>
        <p className="text-xl">Olá, {profile?.nickname || 'Gestor'}!</p>
        <p className="mt-2 text-gray-600">Bem-vindo(a) ao seu painel de controle do Facillit Edu.</p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Gerenciamento de Turmas</h2>
            <p className="mt-2">Aqui você poderá criar turmas e gerar códigos de convite para os alunos.</p>
            {/* O componente de gerenciamento de turmas virá aqui */}
        </div>
      </main>
    </div>
  );
};

export default GestorDashboard;