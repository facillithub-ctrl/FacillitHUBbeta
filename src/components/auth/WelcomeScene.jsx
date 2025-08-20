import React, { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const WelcomeScene = ({ onStart, onShowLogin, onStartWithCode }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode) {
      showNotification('Por favor, insira um código.', 'error');
      return;
    }
    setLoading(true);

    // Busca o código no Supabase
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('code', inviteCode.toUpperCase())
      .eq('is_used', false)
      .single();

    if (error || !data) {
      showNotification('Código inválido ou já utilizado.', 'error');
    } else {
      showNotification('Código válido! Prossiga com o cadastro.');
      // Envia os dados do convite para o componente pai (AuthPage)
      onStartWithCode(data);
    }

    setLoading(false);
  };

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

        <form onSubmit={handleCodeSubmit} className="space-y-3">
          <Input 
            id="invite-code" 
            placeholder="Insira seu código institucional" 
            icon="tag"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <Button type="submit" variant="secondary" fullWidth={true} disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar com código'}
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