import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import HomePage from '../pages/dashboard/HomePage';
import FacillitEduLayout from '../pages/dashboard/FacillitEduLayout';
import TurmasPage from '../pages/dashboard/TurmasPage';
import StudentDashboardLayout from '../pages/dashboard/StudentDashboardLayout'; // Nova importação

// Componente para proteger rotas (sem mudanças)
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

          {/* Rota principal do Dashboard do Gestor */}
          <Route 
            path="/dashboard/gestor" 
            element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
          >
            <Route index element={<HomePage />} />
            <Route path="edu" element={<FacillitEduLayout />}>
                <Route index element={<div>Visão Geral do Módulo Edu</div>} />
                <Route path="turmas" element={<TurmasPage />} />
            </Route>
          </Route>

          {/* NOVAS ROTAS PARA O DASHBOARD DO ALUNO */}
          <Route
            path="/dashboard/aluno"
            element={<ProtectedRoute><StudentDashboardLayout /></ProtectedRoute>}
          >
              {/* Página inicial do aluno */}
              <Route index element={<div><h1>Meu Dia</h1><p>Bem-vindo ao seu Hub!</p></div>} />
              {/* Outras rotas do aluno aqui, ex: /dashboard/aluno/edu */}
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;