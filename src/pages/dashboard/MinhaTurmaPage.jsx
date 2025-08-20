import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const MinhaTurmaPage = () => {
    const { profile } = useAuth();
    const { showNotification } = useNotification();
    const [turmas, setTurmas] = useState([]); // Agora vamos buscar turmas
    const [loading, setLoading] = useState(true);

    const fetchProfessorData = useCallback(async () => {
        if (!profile) return;
        setLoading(true);

        // 1. Buscar todas as turmas e matérias que o professor leciona
        const { data: teacherClassesData, error: teacherClassesError } = await supabase
            .from('class_teachers')
            .select(`
                classes ( id, name ),
                subjects ( name )
            `)
            .eq('teacher_id', profile.id);

        if (teacherClassesError) {
            showNotification('Erro ao buscar suas turmas.', 'error');
            setLoading(false);
            return;
        }

        if (!teacherClassesData || teacherClassesData.length === 0) {
            setTurmas([]);
            setLoading(false);
            return;
        }

        // 2. Para cada turma, buscar os alunos matriculados
        const turmasComAlunos = await Promise.all(
            teacherClassesData.map(async (tc) => {
                const { data: enrollmentData, error: enrollmentError } = await supabase
                    .from('class_enrollments')
                    .select('profiles (id, full_name, nickname)')
                    .eq('class_id', tc.classes.id);
                
                return {
                    id: tc.classes.id,
                    name: tc.classes.name,
                    subject: tc.subjects.name,
                    students: enrollmentError ? [] : enrollmentData.map(e => e.profiles)
                };
            })
        );
        
        setTurmas(turmasComAlunos);
        setLoading(false);

    }, [profile, showNotification]);

    useEffect(() => {
        if (profile) {
            fetchProfessorData();
        }
    }, [profile, fetchProfessorData]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Minhas Turmas</h2>
            
            {loading && <p>Carregando informações...</p>}
            
            {!loading && turmas.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">Você ainda não foi vinculado a nenhuma turma.</p>
                </div>
            )}

            {!loading && turmas.length > 0 && (
                <div className="space-y-8">
                    {turmas.map(turma => (
                        <div key={turma.id + turma.subject} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-brand-dark-blue">{turma.name}</h3>
                            <p className="text-md text-brand-cyan mb-4">Matéria: {turma.subject}</p>
                            
                            {turma.students.length > 0 ? (
                                <ul className="space-y-3">
                                    {turma.students.map(student => (
                                        <li key={student.id} className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                                            <p className="font-medium">{student.full_name}</p>
                                            <p className="text-sm text-gray-500">{student.nickname}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">Nenhum aluno matriculado nesta turma ainda.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MinhaTurmaPage;