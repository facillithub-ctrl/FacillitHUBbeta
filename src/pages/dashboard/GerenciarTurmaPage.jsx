import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Componente para um card de seção
const ManagementCard = ({ title, children }) => (
    <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4 text-brand-dark-blue">{title}</h3>
        {children}
    </div>
);

const GerenciarTurmaPage = () => {
    const { classId } = useParams(); // Pega o ID da turma da URL
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { showNotification } = useNotification();

    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para o gerenciamento
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [classTeachers, setClassTeachers] = useState([]);

    // Estados dos formulários
    const [newSubject, setNewSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');


    // --- FUNÇÕES DE BUSCA DE DADOS ---
    const fetchData = useCallback(async () => {
        if (!profile?.organization_id || !classId) return;

        setLoading(true);

        // 1. Buscar informações da turma
        const { data: classData } = await supabase.from('classes').select('name').eq('id', classId).single();
        if (classData) setClassInfo(classData);
        else {
            showNotification("Turma não encontrada.", "error");
            navigate('/dashboard/gestor/edu/turmas');
            return;
        }
        
        // 2. Buscar matérias da organização
        const { data: subjectsData } = await supabase.from('subjects').select('*').eq('organization_id', profile.organization_id);
        setSubjects(subjectsData || []);

        // 3. Buscar todos os professores da organização
        const { data: teachersData } = await supabase.from('profiles').select('id, full_name').eq('organization_id', profile.organization_id).eq('profile_type', 'Sou professor(a)');
        setTeachers(teachersData || []);

        // 4. Buscar todos os alunos da organização
        const { data: studentsData } = await supabase.from('profiles').select('id, full_name').eq('organization_id', profile.organization_id).in('profile_type', ['Sou aluno(a)', 'Sou vestibulando(a)']);
        setStudents(studentsData || []);
        
        // 5. Buscar alunos já matriculados na turma
        const { data: enrolledData } = await supabase.from('class_enrollments').select('profiles(id, full_name)').eq('class_id', classId);
        setEnrolledStudents(enrolledData.map(e => e.profiles) || []);

        // 6. Buscar professores já vinculados à turma
        const { data: classTeachersData } = await supabase.from('class_teachers').select('profiles(id, full_name), subjects(id, name)').eq('class_id', classId);
        setClassTeachers(classTeachersData || []);


        setLoading(false);
    }, [classId, profile, showNotification, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- FUNÇÕES DE MANIPULAÇÃO ---

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;

        const { error } = await supabase.from('subjects').insert({ name: newSubject, organization_id: profile.organization_id });
        if (error) {
            showNotification(error.message, 'error');
        } else {
            showNotification("Matéria adicionada!", "success");
            setNewSubject('');
            fetchData(); // Re-busca os dados
        }
    };

    const handleAssignTeacher = async (e) => {
        e.preventDefault();
        if (!selectedTeacher || !selectedSubject) {
            showNotification("Selecione um professor e uma matéria.", "error");
            return;
        }

        const { error } = await supabase.from('class_teachers').insert({
            class_id: classId,
            teacher_id: selectedTeacher,
            subject_id: selectedSubject
        });

        if (error) {
            showNotification("Este professor já está vinculado a esta matéria nesta turma.", "error");
        } else {
            showNotification("Professor vinculado com sucesso!", "success");
            setSelectedTeacher('');
            setSelectedSubject('');
            fetchData();
        }
    };
    
    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            showNotification("Selecione um aluno para matricular.", "error");
            return;
        }
        
        const { error } = await supabase.from('class_enrollments').insert({
            class_id: classId,
            student_id: selectedStudent
        });

        if (error) {
            showNotification("Este aluno já está matriculado nesta turma.", "error");
        } else {
            showNotification("Aluno matriculado com sucesso!", "success");
            setSelectedStudent('');
            fetchData();
        }
    };


    if (loading) return <div>Carregando informações da turma...</div>;

    return (
        <div>
            <div className="flex items-center mb-8">
                <Button variant="secondary" onClick={() => navigate('/dashboard/gestor/edu/turmas')}>Voltar</Button>
                <h2 className="text-2xl font-bold text-brand-dark-blue ml-4">Gerenciando a Turma: {classInfo?.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna da Esquerda: Matérias e Professores */}
                <div className="space-y-8">
                    <ManagementCard title="Matérias">
                        <form onSubmit={handleAddSubject} className="flex items-center gap-4">
                            <Input id="newSubject" placeholder="Nome da Matéria" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
                            <Button type="submit">Adicionar</Button>
                        </form>
                        <ul className="mt-4 space-y-2">
                           {subjects.map(s => <li key={s.id} className="p-2 bg-white rounded border">{s.name}</li>)}
                        </ul>
                    </ManagementCard>
                    
                    <ManagementCard title="Vincular Professores">
                        <form onSubmit={handleAssignTeacher} className="space-y-4">
                            <Select id="subject" label="Selecione a Matéria" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                <option value="">-- Matérias --</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                            <Select id="teacher" label="Selecione o Professor" value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
                                <option value="">-- Professores --</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                            </Select>
                            <Button type="submit" fullWidth>Vincular Professor</Button>
                        </form>
                        <h4 className="font-semibold mt-6 mb-2">Professores Vinculados:</h4>
                        <ul className="space-y-2">
                            {classTeachers.map(ct => <li key={`${ct.profiles.id}-${ct.subjects.id}`} className="p-2 bg-white rounded border">{ct.profiles.full_name} - <strong>{ct.subjects.name}</strong></li>)}
                        </ul>
                    </ManagementCard>
                </div>

                {/* Coluna da Direita: Alunos */}
                <div className="space-y-8">
                    <ManagementCard title="Matricular Alunos">
                        <form onSubmit={handleEnrollStudent} className="space-y-4">
                             <Select id="student" label="Selecione o Aluno" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                                <option value="">-- Alunos Disponíveis --</option>
                                {students.filter(s => !enrolledStudents.some(es => es.id === s.id)).map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                            </Select>
                            <Button type="submit" fullWidth>Matricular Aluno</Button>
                        </form>
                        <h4 className="font-semibold mt-6 mb-2">Alunos Matriculados:</h4>
                         <ul className="space-y-2">
                            {enrolledStudents.map(s => <li key={s.id} className="p-2 bg-white rounded border">{s.full_name}</li>)}
                        </ul>
                    </ManagementCard>
                </div>
            </div>
        </div>
    );
};

export default GerenciarTurmaPage;