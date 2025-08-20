import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';

// Dashboards Layouts
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import StudentDashboardLayout from '../pages/dashboard/StudentDashboardLayout';
import ProfessorDashboardLayout from '../pages/dashboard/ProfessorDashboardLayout';

// Páginas
import HomePage from '../pages/dashboard/HomePage';
import FacillitEduLayout from '../pages/dashboard/FacillitEduLayout';
import TurmasPage from '../pages/dashboard/TurmasPage';
import ConvitesPage from '../pages/dashboard/ConvitesPage';
import GerenciarTurmaPage from '../pages/dashboard/GerenciarTurmaPage'; // 1. Importar a nova página
import MinhaTurmaPage from '../pages/dashboard/MinhaTurmaPage';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  return session ? children : <Navigate to="/" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />

          {/* Rota do Gestor */}
          <Route path="/dashboard/gestor" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="edu" element={<FacillitEduLayout />}>
                <Route index element={<div className="text-center p-8"><h2 className="text-xl font-semibold">Bem-vindo(a) à Visão Geral!</h2><p className="text-gray-500 mt-2">Selecione uma opção acima para começar.</p></div>} />
                <Route path="turmas" element={<TurmasPage />} />
                <Route path="convites" element={<ConvitesPage />} />
                {/* 2. Adicionar a nova rota dinâmica */}
                <Route path="turma/:classId" element={<GerenciarTurmaPage />} />
            </Route>
          </Route>

          {/* Rota do Professor */}
          <Route path="/dashboard/professor" element={<ProtectedRoute><ProfessorDashboardLayout /></ProtectedRoute>}>
            <Route index element={<MinhaTurmaPage />} />
            {/* ... outras rotas de professor */}
          </Route>

          {/* Rota do Aluno */}
          <Route path="/dashboard/aluno" element={<ProtectedRoute><StudentDashboardLayout /></ProtectedRoute>}>
              <Route index element={<div><h1>Meu Dia</h1><p>Bem-vindo ao seu Hub!</p></div>} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;