import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SocialButton = ({ children, icon }) => (
    <button className="flex items-center justify-center w-full py-2.5 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
        <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-brand-cyan">
            {icon ? icon : 'F'} 
        </span>
        <span className="font-medium text-gray-700">{children}</span>
    </button>
);

const Login = ({ onShowRegister }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-dark-blue">Olá novamente!</h1>
        <p className="mt-2 text-gray-600">Que bom te ver por aqui.</p>
      </div>

      <div className="space-y-4">
        <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" />
        <Input id="password" label="Senha" type="password" placeholder="Sua senha" />
      </div>

      <div className="space-y-4">
        <Button fullWidth={true}>Entrar</Button>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-brand-white px-2 text-gray-500">Ou continue com</span>
            </div>
        </div>
        <div className="space-y-3">
            <SocialButton>Continuar com Google</SocialButton>
            <SocialButton>Continuar com Apple</SocialButton>
        </div>
      </div>
      
      <p className="text-sm text-center text-gray-600">
        Ainda não tem uma conta?{' '}
        <button onClick={onShowRegister} className="font-semibold text-brand-cyan hover:underline">
          Crie uma agora
        </button>
      </p>
    </div>
  );
};

export default Login;