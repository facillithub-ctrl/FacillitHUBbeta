import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota "/" será nossa página de login/cadastro */}
        <Route path="/" element={<AuthPage />} />

        {/* Adicione outras rotas aqui no futuro, como o dashboard */}
        {/* Ex: <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;