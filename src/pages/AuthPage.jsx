import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import WelcomeScene from '../components/auth/WelcomeScene';
import Login from '../components/auth/Login';
import RegisterFlow from '../components/auth/RegisterFlow';

const AuthPage = () => {
  const [view, setView] = useState('welcome');
  const [initialData, setInitialData] = useState(null);
  const { session, loading } = useAuth();

  const handleStartWithCode = (inviteData) => {
    // Prepara os dados que o formulário de registro receberá
    const prefilledData = {
      profileType: 'Sou aluno(a)',
      full_name: inviteData.student_full_name,
      birth_date: inviteData.student_birth_date,
      invite: inviteData // Passa o objeto completo do convite
    };
    setInitialData(prefilledData);
    setView('register'); // Muda a tela para o fluxo de registro
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-primary flex items-center justify-center text-white">Carregando...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard/gestor" />;
  }

  const renderView = () => {
    switch (view) {
      case 'login':
        return <Login onShowRegister={() => setView('welcome')} />;
      case 'register':
        return <RegisterFlow onShowLogin={() => setView('login')} initialData={initialData} />;
      case 'welcome':
      default:
        return <WelcomeScene onStart={() => setView('register')} onShowLogin={() => setView('login')} onStartWithCode={handleStartWithCode} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-primary flex items-center justify-center p-4 font-sans">
      <Card>
        {renderView()}
      </Card>
    </div>
  );
};

export default AuthPage;