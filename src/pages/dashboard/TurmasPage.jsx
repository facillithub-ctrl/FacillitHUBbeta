import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const TurmasPage = () => {
  const { profile } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');

  const fetchClasses = useCallback(async () => {
    if (!profile?.organization_id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('name', { ascending: true });

    if (error) {
      showNotification('Erro ao buscar turmas.', 'error');
    } else {
      setClasses(data);
    }
    setLoading(false);
  }, [profile, showNotification]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showNotification('O nome da turma não pode estar vazio.', 'error');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('classes').insert({
      name: newClassName,
      organization_id: profile.organization_id,
    });

    if (error) {
      showNotification(`Erro ao criar turma: ${error.message}`, 'error');
    } else {
      showNotification(`Turma "${newClassName}" criada com sucesso!`);
      setNewClassName('');
      fetchClasses();
    }
    setLoading(false);
  };

  if (!profile?.organization_id) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Acesso Restrito</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-red-600">Seu perfil de usuário não está vinculado a nenhuma organização. Por favor, entre em contato com o suporte.</p>
            </div>
        </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Criar Nova Turma</h3>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <Input 
              id="newClassName" 
              label="Nome da Turma" 
              placeholder="Ex: 3º Ano A - Manhã"
              value={newClassName} 
              onChange={(e) => setNewClassName(e.target.value)} 
              required 
            />
            <div className="pt-2">
              <Button type="submit" disabled={loading} fullWidth={true}>
                {loading ? 'Criando...' : 'Criar Turma'}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Turmas Cadastradas</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {loading && <p>Carregando turmas...</p>}
            {!loading && classes.length > 0 ? (
              classes.map(cls => (
                <div key={cls.id} className="flex justify-between items-center bg-white p-4 rounded-md border">
                  <p className="font-semibold">{cls.name}</p>
                  {/* 2. Substituir o Button por um Link */}
                  <Link to={`/dashboard/gestor/edu/turma/${cls.id}`}>
                    <Button variant="secondary">
                      Gerenciar
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              !loading && <p className="text-gray-500">Nenhuma turma cadastrada ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurmasPage;