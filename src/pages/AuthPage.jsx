import React, { useState } from 'react';
import Card from '../components/ui/Card';
import WelcomeScene from '../components/auth/WelcomeScene';
import Login from '../components/auth/Login';
import RegisterFlow from '../components/auth/RegisterFlow';

const AuthPage = () => {
  const [view, setView] = useState('welcome');

  const renderView = () => {
    switch (view) {
      case 'login':
        return <Login onShowRegister={() => setView('welcome')} />;
      case 'register':
        return <RegisterFlow onShowLogin={() => setView('login')} />;
      case 'welcome':
      default:
        return <WelcomeScene onStart={() => setView('register')} onShowLogin={() => setView('login')} />;
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