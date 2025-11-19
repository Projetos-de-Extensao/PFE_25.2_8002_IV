import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaCoordenador() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState({ monitores: 0, candidatos: 0, vagas: 0, cursos: 0 });
    const [cursos, setCursos] = useState([]); // Para estatísticas
    const [disciplinas, setDisciplinas] = useState([]); // Para o formulário
    const [loading, setLoading] = useState(true);
    
    // Estado do Formulário de Nova Vaga
    const [novaVaga, setNovaVaga] = useState({ disciplina_id: '', unidade: 'Barra' });

    const navigate = useNavigate();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    // Função para Criar a Vaga
    const handleCriarVaga = async (e) => {
        e.preventDefault();
        if (!novaVaga.disciplina_id) return alert("Selecione uma disciplina!");

        try {
            const { error } = await supabase.from('vagas').insert([{
                disciplina_id: novaVaga.disciplina_id,
                unidade: novaVaga.unidade,
                status: 'ABERTA'
            }]);

            if (error) throw error;

            alert("Vaga criada com sucesso!");
            // Recarrega dados
            window.location.reload(); 

        } catch (err) {
            alert("Erro ao criar vaga: " + err.message);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                // Buscas para Dashboard...
                const { count: monitoresCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'monitor');
                const { count: candidatosCount } = await supabase.from('inscricoes').select('*', { count: 'exact', head: true }).eq('status', 'PENDENTE');
                const { count: vagasCount } = await supabase.from('vagas').select('*', { count: 'exact', head: true });
                
                // Busca Cursos (para lista)
                const { data: cursosData } = await supabase.from('cursos').select('*');
                
                // Busca Disciplinas (para o formulário)
                const { data: discData } = await supabase.from('disciplinas').select('*');

                setStats({
                    monitores: monitoresCount || 0,
                    candidatos: candidatosCount || 0,
                    vagas: vagasCount || 0,
                    cursos: cursosData?.length || 0
                });
                setCursos(cursosData || []);
                setDisciplinas(discData || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <div className="header-left" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <button className="hamburger-menu" onClick={toggleSidebar}><span className="material-icons">menu</span></button>
                    <img src={logo} alt="IBMEC" className="ibmec-logo" />
                    <div className="system-title"><strong>Sistema de Monitoria</strong><small>Coordenador</small></div>
                </div>
                <div className="header-right">
                     <div className="user-profile">
                        <div className="user-info" style={{textAlign:'right'}}><span className="user-name">Coordenação</span><span className="user-role">Admin</span></div>
                        <div className="user-avatar">CD</div>
                    </div>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><a href="#" onClick={closeSidebar}><span className="material-icons">analytics</span> Dashboard</a></li>
                        <li className="sidebar-nav-item"><a href="#" onClick={closeSidebar}><span className="material-icons">calendar_today</span> Processos Seletivos</a></li>
                        <li className="sidebar-nav-item"><a href="#" onClick={closeSidebar}><span className="material-icons">person_outline</span> Monitores</a></li>
                        <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                            <a href="#" onClick={handleLogout} style={{color: '#dc2626'}}><span className="material-icons">logout</span> Sair</a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={closeSidebar}>
                <h1>Painel do Coordenador</h1>

                <div className="stats-grid">
                    <div className="card"><p className="text-muted">Vagas Totais</p><div className="card-title">{stats.vagas}</div></div>
                    <div className="card"><p className="text-muted">Candidatos</p><div className="card-title">{stats.candidatos}</div></div>
                    <div className="card"><p className="text-muted">Monitores</p><div className="card-title">{stats.monitores}</div></div>
                    <div className="card"><p className="text-muted">Cursos</p><div className="card-title">{stats.cursos}</div></div>
                </div>

                {/* --- FORMULÁRIO DE CRIAÇÃO DE VAGA --- */}
                <div className="card" style={{borderLeft: '5px solid #003366'}}>
                    <div className="card-header"><h4>Abrir Novo Processo Seletivo (Vaga)</h4></div>
                    <form onSubmit={handleCriarVaga} style={{display:'flex', gap:'1rem', alignItems:'flex-end', flexWrap:'wrap'}}>
                        <div style={{flex:1}}>
                            <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Disciplina</label>
                            <select 
                                className="form-control" 
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
                                value={novaVaga.disciplina_id}
                                onChange={(e) => setNovaVaga({...novaVaga, disciplina_id: e.target.value})}
                                required
                            >
                                <option value="">Selecione a disciplina...</option>
                                {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                            </select>
                        </div>
                        <div style={{flex:1}}>
                            <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Unidade</label>
                            <select 
                                className="form-control" 
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
                                value={novaVaga.unidade}
                                onChange={(e) => setNovaVaga({...novaVaga, unidade: e.target.value})}
                            >
                                <option value="Barra">Barra</option>
                                <option value="Botafogo">Botafogo</option>
                                <option value="Centro">Centro</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{height:'42px'}}>
                            <span className="material-icons">add</span> Criar Vaga
                        </button>
                    </form>
                </div>

                <h2>Cursos Cadastrados</h2>
                <div className="card">
                    <div className="card-content">
                        {loading ? <p>Carregando...</p> : cursos.map(c => (
                            <div className="monitor-item" key={c.id}>
                                <div className="monitor-info"><h5>{c.nome}</h5><p className="text-muted">Slug: {c.slug}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
export default TelaCoordenador;