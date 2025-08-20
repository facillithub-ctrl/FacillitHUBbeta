import React, { useState } from 'react';

const SceneProfileType = ({ onNext }) => {
    const roles = [
        "Sou aluno(a)", 
        "Sou professor(a)", 
        "Sou gestor(a) escolar", 
        "Sou especialista(a)", 
        "Sou autônomo(a)", 
        "Sou vestibulando(a)"
    ];
    
    return (
        <div className="text-center space-y-6">
            <h2 className="text-xl font-semibold text-brand-dark-blue">Primeiramente, me conta: em qual desses grupos você se enquadra?</h2>
            <div className="grid grid-cols-2 gap-4">
                {roles.map(role => (
                    <button 
                        key={role} 
                        onClick={() => onNext({ role })} 
                        className="p-4 border rounded-lg text-brand-dark-blue font-medium hover:bg-brand-teal hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>
    );
};

const RegisterFlow = ({ onShowLogin }) => {
    const [scene, setScene] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
        setScene(prev => prev + 1);
        console.log("Dados atuais do formulário:", { ...formData, ...data });
    };
    
    return (
        <div className="space-y-6">
             {scene === 1 && <SceneProfileType onNext={handleNext} />}
             
             {scene > 1 && (
                <div className="text-center space-y-4">
                    <p className="font-semibold text-brand-dark-blue">Ótimo! Perfil selecionado.</p>
                    <p className="text-gray-600">As próximas etapas do formulário serão construídas aqui.</p>
                </div>
             )}
            
            <p className="text-sm text-center text-gray-600">
                Já tem uma conta?{' '}
                <button onClick={onShowLogin} className="font-semibold text-brand-cyan hover:underline">
                    Faça login
                </button>
            </p>
        </div>
    );
};

export default RegisterFlow;