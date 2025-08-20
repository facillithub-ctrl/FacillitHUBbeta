import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import GestorDashboard from '../pages/dashboard/GestorDashboard';

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return <div>Carregando...</div>; // Ou um spinner/skeleton
  return session ? children : <Navigate to="/" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota Pública: Login/Cadastro */}
          <Route path="/" element={<AuthPage />} />

          {/* Rota Protegida: Dashboard do Gestor */}
          <Route 
            path="/dashboard/gestor" 
            element={
              <ProtectedRoute>
                <GestorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Adicione outras rotas aqui */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;