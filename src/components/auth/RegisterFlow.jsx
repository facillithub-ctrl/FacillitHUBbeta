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

const SceneCommonData = ({ data, onNext, onBack }) => {
    const [formData, setFormData] = useState(data);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-brand-dark-blue">Ótimo! Agora vamos criar seu perfil.</h2>
            </div>
            <Input id="full_name" name="full_name" label="Nome Completo" placeholder="Seu nome completo" value={formData.full_name || ''} onChange={handleChange} />
            <Input id="nickname" name="nickname" label="Como devemos te chamar?" placeholder="Seu nome ou apelido" value={formData.nickname || ''} onChange={handleChange} />
            <Input id="birth_date" name="birth_date" label="Data de Nascimento" type="date" value={formData.birth_date || ''} onChange={handleChange} />
            <Input id="contact_number" name="contact_number" label="Número para Contato" placeholder="(XX) XXXXX-XXXX" value={formData.contact_number || ''} onChange={handleChange} />
            <Checkbox id="whatsapp_consent" name="whatsapp_consent" label="Aceita receber comunicados pelo WhatsApp?" checked={formData.whatsapp_consent || false} onChange={handleCheckboxChange} />
            <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
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
        const addressForm = (
             <>
                <Input id="address_cep" name="address_cep" label="CEP" placeholder="Apenas números" onBlur={handleCepBlur} onChange={handleChange} value={details.address_cep || ''}/>
                <Input id="address_street" name="address_street" label="Rua" placeholder={cepLoading ? "Buscando..." : "Preenchido automaticamente"} value={details.address_street || ''} onChange={handleChange} disabled={true} />
                <Input id="address_neighborhood" name="address_neighborhood" label="Bairro" placeholder="Preenchido automaticamente" value={details.address_neighborhood || ''} onChange={handleChange} disabled={true} />
                <div className="flex gap-4">
                  <Input id="address_city" name="address_city" label="Cidade" placeholder="Preenchido automaticamente" value={details.address_city || ''} onChange={handleChange} disabled={true} />
                  <Input id="address_state" name="address_state" label="Estado" placeholder="UF" value={details.address_state || ''} onChange={handleChange} disabled={true} />
                </div>
                <div className="flex gap-4">
                  <Input id="address_number" name="address_number" label="Número" value={details.address_number || ''} onChange={handleChange} />
                  <Input id="address_complement" name="address_complement" label="Complemento" placeholder="Apto, etc." value={details.address_complement || ''} onChange={handleChange} />
                </div>
            </>
        );

        switch (data.profileType) {
            case 'Sou aluno(a)':
            case 'Sou vestibulando(a)':
                return (
                    <>
                        <Input id="school_name" name="school_name" label="Qual a sua escola?" placeholder="Nome da instituição de ensino" value={details.school_name || ''} onChange={handleChange} />
                        <Input id="registration_number" name="registration_number" label="Número de Matrícula (Opcional)" value={details.registration_number || ''} onChange={handleChange} />
                        <Select id="school_level" name="school_level" label="Selecione sua escolaridade" value={details.school_level || ''} onChange={handleChange}>
                            <option value="">Selecione...</option>
                            <option>Ensino Fundamental Incompleto</option>
                            <option>Ensino Fundamental Completo</option>
                            <option>Ensino Médio Incompleto</option>
                            <option>Ensino Médio Completo</option>
                            <option>Ensino Superior Incompleto</option>
                            <option>Ensino Superior Completo</option>
                        </Select>
                        {addressForm}
                    </>
                );
            case 'Sou professor(a)':
                return (
                    <>
                        <Input id="teaching_level" name="teaching_level" label="Nível em que leciona" placeholder="Ex: Ensino Médio" value={details.teaching_level || ''} onChange={handleChange} />
                        <Input id="degree" name="degree" label="Sua principal formação" placeholder="Ex: Licenciatura em Letras" value={details.degree || ''} onChange={handleChange} />
                        <Input id="institution_name" name="institution_name" label="Instituição onde leciona" placeholder="Nome do colégio ou faculdade" value={details.institution_name || ''} onChange={handleChange} />
                        <Input id="experience_years" name="experience_years" label="Tempo de experiência (anos)" type="number" value={details.experience_years || ''} onChange={handleChange} />
                    </>
                );
            case 'Sou gestor(a) escolar':
                 return (
                    <>
                        <Input id="role" name="role" label="Seu Cargo" placeholder="Ex: Coordenador(a) Pedagógico(a)" value={details.role || ''} onChange={handleChange} />
                        <Input id="institution_name" name="institution_name" label="Nome da Instituição" value={details.institution_name || ''} onChange={handleChange} />
                        <Input id="institution_level" name="institution_level" label="Nível da Instituição" placeholder="Ex: Fundamental e Médio" value={details.institution_level || ''} onChange={handleChange} />
                        <Input id="students_number" name="students_number" label="Número aproximado de alunos" type="number" value={details.students_number || ''} onChange={handleChange} />
                    </>
                );
            case 'Sou especialista(a)':
                return (
                    <>
                        <Input id="specialization_area" name="specialization_area" label="Área de Especialização" placeholder="Ex: Psicopedagogia" value={details.specialization_area || ''} onChange={handleChange} />
                        <Input id="academic_background" name="academic_background" label="Formação Acadêmica" placeholder="Ex: Mestrado em Psicologia" value={details.academic_background || ''} onChange={handleChange} />
                        <Select id="service_location" name="service_location" label="Local de Atendimento" value={details.service_location || ''} onChange={handleChange}>
                            <option value="">Selecione...</option>
                            <option>Online</option>
                            <option>Presencial</option>
                            <option>Híbrido</option>
                        </Select>
                    </>
                );
            case 'Sou autônomo(a)':
                return (
                     <>
                        <Input id="field_of_work" name="field_of_work" label="Área de Atuação" placeholder="Ex: Consultoria Educacional" value={details.field_of_work || ''} onChange={handleChange} />
                        <Input id="certifications" name="certifications" label="Formação ou Certificações" placeholder="Ex: Certificação Google for Education" value={details.certifications || ''} onChange={handleChange} />
                        <Select id="work_model" name="work_model" label="Forma de Trabalho" value={details.work_model || ''} onChange={handleChange}>
                            <option value="">Selecione...</option>
                            <option>Remoto</option>
                            <option>Presencial</option>
                            <option>Híbrido</option>
                        </Select>
                    </>
                );
            default:
                return (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Nenhum detalhe adicional é necessário para este perfil.</p>
                        <p className="text-gray-600 mt-2">Podemos prosseguir para a criação do seu acesso.</p>
                    </div>
                );
        }
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

// CENA FINAL: Detalhes de Autenticação (Com a correção)
const SceneAuthDetails = ({ onFinalSubmit, onBack, loading }) => { // 1. Recebe 'loading' como prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            showNotification("As senhas não coincidem!", 'error');
            return;
        }
        onFinalSubmit({ email, password });
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6"><h2 className="text-xl font-semibold text-brand-dark-blue">Para finalizar, crie seu acesso.</h2></div>
            <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input id="password" label="Crie uma Senha" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input id="confirmPassword" label="Confirme a Senha" type="password" placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Checkbox id="terms_consent" label="Concordo com os Termos de Uso e Políticas de Privacidade." checked={agreed} onChange={() => setAgreed(!agreed)} />
            <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
                {/* 2. O botão agora usa o estado 'loading' */}
                <Button onClick={handleSubmit} disabled={!agreed || loading}>
                    {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </Button>
            </div>
        </div>
    );
};

// --- Componente Controlador Principal ---

const RegisterFlow = ({ onShowLogin }) => {
    const totalScenes = 4;
    const [scene, setScene] = useState(1);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleFinalSubmit = async ({ email, password }) => {
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
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
                    category_details: formData.category_details
                });
            
            if (profileError) {
                showNotification(profileError.message, 'error');
            } else {
                showNotification("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
            }
        }
        setLoading(false);
    };

    const handleNext = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
        if (scene < totalScenes) {
            setScene(scene + 1);
        }
    };

    const handleBack = () => { if (scene > 1) setScene(scene - 1) };

    const renderScene = () => {
        switch (scene) {
            case 1: return <SceneProfileType onNext={handleNext} />;
            case 2: return <SceneCommonData data={formData} onNext={handleNext} onBack={handleBack} />;
            case 3: return <SceneCategorySpecific data={formData} onNext={handleNext} onBack={handleBack} />;
            // 3. Passamos o estado 'loading' para a cena final
            case 4: return <SceneAuthDetails onFinalSubmit={handleFinalSubmit} onBack={handleBack} loading={loading} />;
            default: return <SceneProfileType onNext={handleNext} />;
        }
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