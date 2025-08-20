import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { supabase } from '../../api/supabaseClient';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';

// --- Componentes de Cenas Individuais ---

const SceneProfileType = ({ onNext }) => {
    const roles = ["Sou aluno(a)", "Sou professor(a)", "Sou gestor(a) escolar", "Sou especialista(a)", "Sou autônomo(a)", "Sou vestibulando(a)"];
    return (
        <div className="text-center space-y-6">
            <h2 className="text-xl font-semibold text-brand-dark-blue">Primeiramente, me conta: em qual desses grupos você se enquadra?</h2>
            <div className="grid grid-cols-2 gap-4">
                {roles.map(role => (
                    <button key={role} onClick={() => onNext({ profileType: role })} className="p-4 border rounded-lg text-brand-dark-blue font-medium hover:bg-brand-teal hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal">
                        {role}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SceneCommonData = ({ data, onNext, onBack, isInstitutional }) => {
    const [formData, setFormData] = useState(data);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-brand-dark-blue">Ótimo! Agora vamos criar seu perfil.</h2>
            </div>
            <Input id="full_name" name="full_name" label="Nome Completo" placeholder="Seu nome completo" value={formData.full_name || ''} onChange={handleChange} disabled={isInstitutional} />
            <Input id="nickname" name="nickname" label="Como devemos te chamar?" placeholder="Seu nome ou apelido" value={formData.nickname || ''} onChange={handleChange} />
            <Input id="birth_date" name="birth_date" label="Data de Nascimento" type="date" value={formData.birth_date || ''} onChange={handleChange} disabled={isInstitutional} />
            <Input id="contact_number" name="contact_number" label="Número para Contato" placeholder="(XX) XXXXX-XXXX" value={formData.contact_number || ''} onChange={handleChange} />
            <Checkbox id="whatsapp_consent" name="whatsapp_consent" label="Aceita receber comunicados pelo WhatsApp?" checked={formData.whatsapp_consent || false} onChange={handleCheckboxChange} />
            <div className="flex justify-between pt-6">
                {!isInstitutional && <Button variant="secondary" onClick={onBack}>Voltar</Button>}
                {isInstitutional && <div></div>}
                <Button onClick={() => onNext(formData)}>Próximo</Button>
            </div>
        </div>
    );
};

const SceneCategorySpecific = ({ data, onNext, onBack }) => {
    const [details, setDetails] = useState(data.category_details || {});
    const [cepLoading, setCepLoading] = useState(false);

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setCepLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const addressData = await response.json();
            if (!addressData.erro) {
                setDetails(prev => ({
                    ...prev,
                    address_cep: cep,
                    address_street: addressData.logradouro,
                    address_neighborhood: addressData.bairro,
                    address_city: addressData.localidade,
                    address_state: addressData.uf,
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        } finally {
            setCepLoading(false);
        }
    };

    const handleChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

    const renderForm = () => {
        // ... (código interno do renderForm continua o mesmo)
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6"><h2 className="text-xl font-semibold text-brand-dark-blue">Só mais alguns detalhes...</h2></div>
            {renderForm()}
            <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
                <Button onClick={() => onNext({ category_details: details })}>Próximo</Button>
            </div>
        </div>
    );
};

const SceneAuthDetails = ({ onFinalSubmit, onBack, loading, initialEmail }) => {
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = () => {
        if (password.length < 6) {
            showNotification("A senha deve ter no mínimo 6 caracteres.", 'error');
            return;
        }
        if (password !== confirmPassword) {
            showNotification("As senhas não coincidem!", 'error');
            return;
        }
        onFinalSubmit({ email, password });
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6"><h2 className="text-xl font-semibold text-brand-dark-blue">Para finalizar, crie seu acesso.</h2></div>
            <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!initialEmail} />
            <Input id="password" label="Crie uma Senha" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input id="confirmPassword" label="Confirme a Senha" type="password" placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Checkbox id="terms_consent" label="Concordo com os Termos de Uso e Políticas de Privacidade." checked={agreed} onChange={() => setAgreed(!agreed)} />
            <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
                <Button onClick={handleSubmit} disabled={!agreed || loading}>
                    {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </Button>
            </div>
        </div>
    );
};

// --- Componente Controlador Principal ---

const RegisterFlow = ({ onShowLogin, initialData = null }) => {
    const isInstitutional = !!initialData;
    const totalScenes = isInstitutional ? 2 : 4; // Aluno: Dados Pessoais -> Senha. Outros: Perfil -> Dados -> Detalhes -> Senha
    const [scene, setScene] = useState(isInstitutional ? 2 : 1);
    const [formData, setFormData] = useState(initialData || {});
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleFinalSubmit = async ({ email, password }) => {
        setLoading(true);
        const finalEmail = formData.invite?.student_email || email;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: finalEmail,
            password,
        });

        if (authError) {
            showNotification(authError.message, 'error');
            setLoading(false);
            return;
        }

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    profile_type: formData.profileType,
                    full_name: formData.full_name,
                    nickname: formData.nickname,
                    birth_date: formData.birth_date,
                    contact_number: formData.contact_number,
                    whatsapp_consent: formData.whatsapp_consent,
                    category_details: formData.category_details,
                    organization_id: formData.invite?.organization_id
                });
            
            if (profileError) {
                showNotification(profileError.message, 'error');
            } else {
                if (isInstitutional) {
                    await supabase.from('invites').update({ is_used: true, used_by: authData.user.id }).eq('id', formData.invite.id);
                }
                showNotification("Cadastro realizado com sucesso!");
            }
        }
        setLoading(false);
    };

    const handleNext = (data) => {
        const newData = { ...formData, ...data };
        setFormData(newData);

        let nextScene = scene + 1;
        // Se for aluno (cadastro institucional), ele pula a cena de detalhes específicos (cena 3)
        if (isInstitutional && nextScene === 3) {
            nextScene = 4; // Pula direto para a criação de senha
        }
        setScene(nextScene);
    };

    const handleBack = () => {
        let prevScene = scene - 1;
        if (isInstitutional && prevScene === 3) {
            prevScene = 2; // Volta da senha para os dados
        }
        if (prevScene >= 1) {
            setScene(prevScene);
        }
    };
    
    // CORREÇÃO DA LÓGICA DE RENDERIZAÇÃO
    const renderScene = () => {
        if (scene === 1) return <SceneProfileType onNext={handleNext} />;
        if (scene === 2) return <SceneCommonData data={formData} onNext={handleNext} onBack={handleBack} isInstitutional={isInstitutional} />;
        if (scene === 3) return <SceneCategorySpecific data={formData} onNext={handleNext} onBack={handleBack} />;
        if (scene === 4) return <SceneAuthDetails onFinalSubmit={handleFinalSubmit} onBack={handleBack} loading={loading} initialEmail={formData.invite?.student_email} />;
        return <SceneProfileType onNext={handleNext} />;
    };

    return (
        <div className="space-y-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${(scene / totalScenes) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            {renderScene()}
            <p className="text-sm text-center text-gray-600 pt-4">
                Já tem uma conta?{' '}
                <button onClick={onShowLogin} className="font-semibold text-brand-cyan hover:underline">
                    Faça login
                </button>
            </p>
        </div>
    );
};

export default RegisterFlow;