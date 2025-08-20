import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import HomePage from '../pages/dashboard/HomePage';
import FacillitEduLayout from '../pages/dashboard/FacillitEduLayout';
import TurmasPage from '../pages/dashboard/TurmasPage';

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
            {/* Páginas aninhadas dentro do DashboardLayout */}
            <Route index element={<HomePage />} />
            
            {/* Rota para o módulo Facillit Edu */}
            <Route path="edu" element={<FacillitEduLayout />}>
                {/* Páginas aninhadas dentro do FacillitEduLayout */}
                <Route index element={<div>Visão Geral do Módulo Edu</div>} />
                <Route path="turmas" element={<TurmasPage />} />
            </Route>

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;