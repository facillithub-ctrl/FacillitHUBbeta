import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const WelcomeScene = ({ onStart, onShowLogin }) => {
  return (
    <div className="text-center space-y-10 flex flex-col h-full justify-between">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark-blue">Seja bem-vindo(a)!</h1>
        <p className="mt-2 text-gray-600">Vamos começar a transformar suas ideias em resultados.</p>
      </div>
      
      <div className="space-y-5">
        <Button onClick={onStart} fullWidth={true}>
          Vamos lá!
        </Button>
        
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">ou</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Formulário de código redesenhado */}
        <form className="space-y-3">
          <Input 
            id="invite-code" 
            placeholder="Insira seu código institucional" 
            icon="tag" // Usando o novo ícone!
          />
          <Button variant="secondary" fullWidth={true}>
            Entrar com código
          </Button>
        </form>
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