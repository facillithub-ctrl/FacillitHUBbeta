import React, { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Login = ({ onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      showNotification(authError.message, 'error');
      setLoading(false);
      return;
    }

    if (authData.user) {
        // Busca o perfil do usuário para decidir para onde redirecionar
        const { data: profile } = await supabase
            .from('profiles')
            .select('profile_type')
            .eq('id', authData.user.id)
            .single();

        showNotification('Login realizado com sucesso!');

        const userType = profile?.profile_type;
        if (userType === 'Sou aluno(a)' || userType === 'Sou vestibulando(a)') {
            navigate('/dashboard/aluno');
        } else {
            navigate('/dashboard/gestor');
        }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-dark-blue">Olá novamente!</h1>
        <p className="mt-2 text-gray-600">Que bom te ver por aqui.</p>
      </div>
      <div className="space-y-4">
        <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Senha" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="space-y-4">
        <Button type="submit" fullWidth={true} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </div>
      <p className="text-sm text-center text-gray-600">
        Ainda não tem uma conta?{' '}
        <button type="button" onClick={onShowRegister} className="font-semibold text-brand-cyan hover:underline">
          Crie uma agora
        </button>
      </p>
    </form>
  );
};

export default Login;