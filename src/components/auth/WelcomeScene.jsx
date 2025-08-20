import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const WelcomeScene = ({ onStart, onShowLogin }) => {
  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark-blue">Seja bem-vindo(a)!</h1>
        <p className="mt-2 text-gray-600">Vamos começar a transformar suas ideias em resultados.</p>
      </div>
      
      <div className="space-y-4">
        <Button onClick={onStart} fullWidth={true}>
          Vamos lá!
        </Button>
        <p className="text-sm text-gray-500">ou</p>
        <div className="flex items-center space-x-2">
          <Input id="invite-code" placeholder="Tenho um código" />
          <Button variant="secondary">Entrar</Button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Já tem uma conta?{' '}
        <button onClick={onShowLogin} className="font-semibold text-brand-cyan hover:underline">
          Faça login
        </button>
      </p>
    </div>
  );
};

export default WelcomeScene;