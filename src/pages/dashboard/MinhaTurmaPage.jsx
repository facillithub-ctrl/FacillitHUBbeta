import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const MinhaTurmaPage = () => {
    const { profile } = useAuth();
    const { showNotification } = useNotification();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = useCallback(async () => {
        if (!profile) return;
        setLoading(true);

        // 1. Encontra a turma do professor
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id')
            .eq('professor_id', profile.id)
            .limit(1) // Por enquanto, pegamos apenas a primeira turma
            .single();

        if (classError || !classData) {
            console.error("Nenhuma turma encontrada para este professor.");
            setStudents([]);
            setLoading(false);
            return;
        }

        // 2. Busca todos os alunos matriculados nessa turma
        const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('class_enrollments')
            .select('profiles(*)') // Puxa todos os dados do perfil do aluno
            .eq('class_id', classData.id);
        
        if (enrollmentError) {
            showNotification('Erro ao buscar alunos.', 'error');
        } else {
            // Extrai apenas os perfis dos alunos do resultado
            setStudents(enrollmentData.map(enrollment => enrollment.profiles));
        }
        setLoading(false);

    }, [profile, showNotification]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Minha Turma</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading && <p>Carregando alunos...</p>}
                {!loading && students.length === 0 && <p>Nenhum aluno encontrado na sua turma.</p>}
                {!loading && students.length > 0 && (
                    <ul className="space-y-4">
                        {students.map(student => (
                            <li key={student.id} className="p-4 border rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{student.full_name}</p>
                                    <p className="text-sm text-gray-500">{student.nickname}</p>
                                </div>
                                <p className="text-sm text-gray-600">Matrícula: {student.category_details?.registration_number || 'N/A'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MinhaTurmaPage;