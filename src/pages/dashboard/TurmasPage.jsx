import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const generateInviteCode = () => `FHUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

const generateStudentEmail = (fullName) => {
  if (!fullName) return '';
  const sanitizedName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
  return `${sanitizedName}@fhub.com`;
};

const TurmasPage = () => {
  const { profile } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    className: '',
    registrationNumber: ''
  });

  const fetchInvites = useCallback(async () => {
    if (!profile?.organization_id) return;
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('is_used', false)
      .order('created_at', { ascending: false });

    if (error) {
      showNotification('Erro ao buscar convites.', 'error');
    } else {
      setInvites(data);
    }
  }, [profile, showNotification]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    // Verificação de segurança adicional
    if (!profile || !profile.organization_id) {
        showNotification('Seu perfil não está vinculado a uma organização.', 'error');
        return;
    }
    setLoading(true);

    const newCode = generateInviteCode();
    const studentEmail = generateStudentEmail(formData.fullName);

    const { error } = await supabase.from('invites').insert({
      code: newCode,
      organization_id: profile.organization_id,
      created_by: profile.id,
      student_full_name: formData.fullName,
      student_birth_date: formData.birthDate,
      student_class: formData.className,
      student_registration_number: formData.registrationNumber,
      student_email: studentEmail
    });

    if (error) {
      showNotification(`Erro ao gerar código: ${error.message}`, 'error');
    } else {
      showNotification(`Código "${newCode}" gerado com sucesso!`);
      setFormData({ fullName: '', birthDate: '', className: '', registrationNumber: '' });
      fetchInvites();
    }
    setLoading(false);
  };

  // Se o perfil do gestor não estiver vinculado a uma organização, mostra um aviso
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
      <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Gerenciar Turmas e Convites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Gerar Novo Convite de Aluno</h3>
          <form onSubmit={handleGenerateInvite} className="space-y-4">
            <Input id="fullName" label="Nome Completo do Aluno" value={formData.fullName} onChange={handleChange} required />
            <Input id="birthDate" label="Data de Nascimento" type="date" value={formData.birthDate} onChange={handleChange} required />
            <Input id="className" label="Turma/Série" placeholder="Ex: 3º Ano B" value={formData.className} onChange={handleChange} required />
            <Input id="registrationNumber" label="Número de Matrícula (Opcional)" value={formData.registrationNumber} onChange={handleChange} />
            <div className="pt-2">
              <Button type="submit" disabled={loading || !formData.fullName} fullWidth={true}>
                {loading ? 'Gerando...' : 'Gerar Código de Convite'}
              </Button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Convites Ativos</h3>
          <div className="space-y-3">
            {invites.length > 0 ? (
              invites.map(invite => (
                <div key={invite.id} className="flex justify-between items-center bg-white p-3 rounded-md border">
                  <div>
                    <p className="font-semibold">{invite.student_full_name}</p>
                    <p className="text-sm text-gray-500">{invite.code}</p>
                  </div>
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(invite.code)}>
                    Copiar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhum convite ativo encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurmasPage;