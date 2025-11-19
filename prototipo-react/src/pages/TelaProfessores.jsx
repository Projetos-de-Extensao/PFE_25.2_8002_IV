import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaProfessores() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profCurso, setProfCurso] = useState(null);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    const fetchCandidatos = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Descobrir a área do Professor
            const { data: profile } = await supabase
                .from('profiles')
                .select('curso_slug')
                .eq('id', user.id)
                .single();
            
            const areaDoProfessor = profile?.curso_slug;
            setProfCurso(areaDoProfessor);

            // 2. Buscar inscrições com DADOS ACADÊMICOS (Sem PDF)
            const { data, error } = await supabase
                .from('inscricoes')
                .select(`
                    id, status, nota_disciplina,
                    profiles:user_id ( 
                        first_name, last_name, matricula, 
                        cr_geral, horas_cursadas 
                    ),
                    vagas ( 
                        unidade, 
                        disciplinas (
                            nome,
                            cursos ( slug, nome ) 
                        ) 
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // 3. Filtrar por Área
            const candidatosFiltrados = data.filter(candidato => {
                const cursoDaVaga = candidato.vagas?.disciplinas?.cursos?.slug;
                if (!areaDoProfessor) return true; 
                return cursoDaVaga === areaDoProfessor;
            });

            setCandidatos(candidatosFiltrados);

        } catch (error) {
            console.error("Erro:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCandidatos(); }, []);

    const handleDecisao = async (id, novaDecisao) => {
        try {
            const { error } = await supabase.from('inscricoes').update({ status: novaDecisao }).eq('id', id);
            if (error) throw error;
            alert(`Candidato ${novaDecisao}!`);
            fetchCandidatos(); 
        } catch (err) {
            alert("Erro: " + err.message);
        }
    };

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <div className="header-left" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <button className="hamburger-menu" onClick={toggleSidebar}>
                        <span className="material-icons">menu</span>
                    </button>
                    <img src={logo} alt="IBMEC" className="ibmec-logo" />
                    <div className="system-title">
                        <strong>Portal do Professor</strong>
                    </div>
                </div>

                <div className="header-right">
                    <div className="user-profile">
                        <div className="user-info" style={{textAlign: 'right'}}>
                            <span className="user-name" style={{fontWeight: 'bold', fontSize:'0.9rem'}}>Docente</span>
                            <span className="user-role" style={{fontSize:'0.75rem', color:'#666'}}>
                                {profCurso ? profCurso.toUpperCase() : 'Geral'}
                            </span>
                        </div>
                        <div className="user-avatar">PF</div>
                    </div>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active">
                            <a href="#" onClick={closeSidebar}>
                                <span className="material-icons">people</span> Seleção de Monitores
                            </a>
                        </li>
                        <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                            <a href="#" onClick={handleLogout} style={{color: '#dc2626'}}>
                                <span className="material-icons">logout</span> Sair
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={closeSidebar}>
                <h1>Seleção de Monitores</h1>
                
                <div style={{marginBottom: '1.5rem', color: '#64748b'}}>
                    Filtro de Área: <strong style={{color: '#003366', textTransform:'uppercase'}}>{profCurso || 'TODAS (Admin)'}</strong>
                </div>

                <div className="card">
                    <div className="card-header"><h4>Candidatos Pendentes</h4></div>
                    
                    {loading && <p style={{padding:'1rem'}}>Carregando...</p>}
                    
                    {!loading && candidatos.length === 0 && (
                        <div style={{padding:'2rem', textAlign:'center', color:'#888'}}>
                            <span className="material-icons" style={{fontSize:'3rem', display:'block', marginBottom:'10px'}}>folder_off</span>
                            <p>Nenhum candidato pendente na sua área.</p>
                        </div>
                    )}

                    {!loading && candidatos.map(c => (
                        <div className="monitor-item" key={c.id} style={{display:'block'}}>
                            
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem'}}>
                                <div className="monitor-info">
                                    <h5 style={{fontWeight: 'bold', fontSize: '1.1rem', color:'#003366'}}>
                                        {c.profiles?.first_name} {c.profiles?.last_name} 
                                        <span style={{fontSize:'0.8rem', color:'#666', fontWeight:'normal', marginLeft:'8px'}}>
                                            ({c.profiles?.matricula || 'Sem Matrícula'})
                                        </span>
                                    </h5>
                                    <p className="text-muted">
                                        Candidato à vaga de: <strong style={{color:'#333'}}>{c.vagas?.disciplinas?.nome}</strong> ({c.vagas?.unidade})
                                    </p>
                                </div>

                                <div style={{textAlign:'right'}}>
                                    <span className={`badge ${c.status === 'APROVADO' ? 'bg-green' : c.status === 'REJEITADO' ? 'bg-red' : 'bg-yellow'}`}>
                                        {c.status}
                                    </span>
                                </div>
                            </div>

                            {/* --- DADOS ACADÊMICOS (LIMPO) --- */}
                            <div style={{
                                backgroundColor: '#f8fafc', 
                                padding: '15px', 
                                borderRadius: '8px', 
                                marginBottom: '15px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                gap: '10px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <span style={{fontSize:'0.75rem', textTransform:'uppercase', color:'#64748b', fontWeight:'bold'}}>CR Geral</span>
                                    <div style={{fontSize:'1.1rem', fontWeight:'bold', color:'#333'}}>{c.profiles?.cr_geral?.toFixed(2)}</div>
                                </div>
                                <div>
                                    <span style={{fontSize:'0.75rem', textTransform:'uppercase', color:'#64748b', fontWeight:'bold'}}>Nota Disciplina</span>
                                    <div style={{fontSize:'1.1rem', fontWeight:'bold', color:'#2563eb'}}>{c.nota_disciplina?.toFixed(1)}</div>
                                </div>
                                <div>
                                    <span style={{fontSize:'0.75rem', textTransform:'uppercase', color:'#64748b', fontWeight:'bold'}}>Horas Cursadas</span>
                                    <div style={{fontSize:'1.1rem', fontWeight:'bold', color:'#333'}}>{c.profiles?.horas_cursadas}h</div>
                                </div>
                                {/* A parte do PDF foi removida daqui */}
                            </div>

                            {/* Botões de Ação */}
                            {c.status === 'PENDENTE' && (
                                <div style={{display: 'flex', gap: '10px', justifyContent:'flex-end'}}>
                                    <button className="btn btn-primary" onClick={() => handleDecisao(c.id, 'APROVADO')}>Aprovar Candidato</button>
                                    <button className="btn btn-action" style={{color:'#dc2626', borderColor:'#dc2626'}} onClick={() => handleDecisao(c.id, 'REJEITADO')}>Rejeitar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default TelaProfessores;