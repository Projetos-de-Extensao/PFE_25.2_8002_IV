import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaCoordenador() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Dados
    const [stats, setStats] = useState({ monitores: 0, candidatos: 0, vagas: 0, cursos: 0 });
    const [cursos, setCursos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [listaVagas, setListaVagas] = useState([]); 
    const [loading, setLoading] = useState(true);

    // Estado do Formulário
    const [novaVaga, setNovaVaga] = useState({ disciplina_id: '', unidade: 'Barra' });

    const navigate = useNavigate();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Função de Scroll Suave
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        closeSidebar();
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    // --- FUNÇÃO: CRIAR VAGA ---
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
            alert("Processo Seletivo aberto com sucesso!");
            window.location.reload(); 

        } catch (err) {
            alert("Erro ao criar vaga: " + err.message);
        }
    };

    // --- FUNÇÃO: ENCERRAR VAGA (NOVA) ---
    const handleEncerrarVaga = async (id) => {
        if (!window.confirm("Tem certeza que deseja encerrar este processo seletivo?")) return;

        try {
            // Atualiza o status para 'ENCERRADA' no banco
            const { error } = await supabase
                .from('vagas')
                .update({ status: 'ENCERRADA' })
                .eq('id', id);

            if (error) throw error;

            alert("Processo encerrado com sucesso.");
            window.location.reload(); // Recarrega para atualizar a lista

        } catch (err) {
            alert("Erro ao encerrar: " + err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Stats
                const { count: monitores } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'monitor');
                const { count: candidatos } = await supabase.from('inscricoes').select('*', { count: 'exact', head: true }).eq('status', 'PENDENTE');
                // Conta apenas vagas ABERTAS para o dashboard fazer mais sentido
                const { count: vagasTotal } = await supabase.from('vagas').select('*', { count: 'exact', head: true }).eq('status', 'ABERTA');
                
                // 2. Listas
                const { data: cursosData } = await supabase.from('cursos').select('*');
                const { data: discData } = await supabase.from('disciplinas').select('*');
                
                // 3. Processos Seletivos (Vagas Abertas)
                const { data: vagasData } = await supabase
                    .from('vagas')
                    .select('*, disciplinas(nome)')
                    .eq('status', 'ABERTA') // Mostra apenas as abertas na lista principal
                    .order('id', { ascending: false });

                setStats({ monitores: monitores || 0, candidatos: candidatos || 0, vagas: vagasTotal || 0, cursos: cursosData?.length || 0 });
                setCursos(cursosData || []);
                setDisciplinas(discData || []);
                setListaVagas(vagasData || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            
            {/* --- HEADER --- */}
            <header className="app-header">
                <div className="header-left" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <button className="hamburger-menu" onClick={toggleSidebar}>
                        <span className="material-icons">menu</span>
                    </button>
                    <img src={logo} alt="IBMEC" className="ibmec-logo" />
                    <div className="system-title"><strong>Sistema de Monitoria</strong><small>CASA</small></div>
                </div>

                <div className="header-right">
                    <div className="user-profile">
                        <div className="user-info" style={{textAlign:'right'}}>
                            {/* MUDANÇA DE NOME AQUI */}
                            <span className="user-name">CASA</span>
                            <span className="user-role">Administração</span>
                        </div>
                        <div className="user-avatar">CS</div>
                    </div>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item">
                            <a href="#dashboard" onClick={(e) => { e.preventDefault(); scrollToSection('dashboard'); }}>
                                <span className="material-icons">analytics</span> Dashboard
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a href="#processos" onClick={(e) => { e.preventDefault(); scrollToSection('processos'); }}>
                                <span className="material-icons">calendar_today</span> Processos Seletivos
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a href="#cursos" onClick={(e) => { e.preventDefault(); scrollToSection('cursos'); }}>
                                <span className="material-icons">school</span> Cursos
                            </a>
                        </li>
                        
                        <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                            <a href="#" onClick={handleLogout} style={{color: '#dc2626'}}><span className="material-icons">logout</span> Sair</a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={closeSidebar}>
                
                {/* --- SECÇÃO 1: DASHBOARD --- */}
                <section id="dashboard" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h1>Painel CASA</h1>
                    <div className="stats-grid">
                        <div className="card"><p className="text-muted">Vagas Abertas</p><div className="card-title">{stats.vagas}</div></div>
                        <div className="card"><p className="text-muted">Candidatos</p><div className="card-title">{stats.candidatos}</div></div>
                        <div className="card"><p className="text-muted">Monitores</p><div className="card-title">{stats.monitores}</div></div>
                        <div className="card"><p className="text-muted">Cursos</p><div className="card-title">{stats.cursos}</div></div>
                    </div>
                </section>

                <hr style={{border:'0', borderTop:'1px solid #eee', marginBottom:'3rem'}} />

                {/* --- SECÇÃO 2: PROCESSOS SELETIVOS --- */}
                <section id="processos" style={{ scrollMarginTop: '100px', marginBottom: '3rem' }}>
                    <h1>Gestão de Processos Seletivos</h1>
                    
                    {/* Formulário */}
                    <div className="card" style={{borderLeft: '5px solid #003366', backgroundColor: '#f8fafc'}}>
                        <div className="card-header" style={{borderBottom:'none', paddingBottom:'0'}}>
                            <h4><span className="material-icons" style={{verticalAlign:'middle', marginRight:'5px'}}>add_circle</span> Abrir Nova Vaga</h4>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleCriarVaga} style={{display:'flex', gap:'1rem', alignItems:'flex-end', flexWrap:'wrap'}}>
                                <div style={{flex:1, minWidth: '200px'}}>
                                    <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600'}}>Disciplina</label>
                                    <select className="form-control" style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #cbd5e1'}}
                                        value={novaVaga.disciplina_id} onChange={(e) => setNovaVaga({...novaVaga, disciplina_id: e.target.value})} required>
                                        <option value="">Selecione...</option>
                                        {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                                    </select>
                                </div>
                                <div style={{flex:1, minWidth: '200px'}}>
                                    <label style={{display:'block', marginBottom:'5px', fontSize:'0.85rem', fontWeight:'600'}}>Unidade</label>
                                    <select className="form-control" style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #cbd5e1'}}
                                        value={novaVaga.unidade} onChange={(e) => setNovaVaga({...novaVaga, unidade: e.target.value})}>
                                        <option value="Barra">Barra</option>
                                        <option value="Botafogo">Botafogo</option>
                                        <option value="Centro">Centro</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{height:'45px', minWidth:'120px'}}>Publicar</button>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Processos Ativos */}
                    <h3>Processos Ativos ({listaVagas.length})</h3>
                    <div className="card">
                        <div className="card-content">
                            {listaVagas.length === 0 && <p style={{padding:'1rem'}}>Nenhum processo seletivo aberto.</p>}
                            
                            {listaVagas.map(vaga => (
                                <div className="monitor-item" key={vaga.id}>
                                    <div className="monitor-info">
                                        <h5 style={{fontWeight:'bold', color:'#003366'}}>{vaga.disciplinas?.nome}</h5>
                                        <p className="text-muted">Unidade: {vaga.unidade}</p>
                                        <p className="text-small">Status: <span className="badge bg-green">{vaga.status}</span></p>
                                    </div>
                                    <div style={{display:'flex', gap:'10px'}}>
                                        {/* BOTÃO DE ENCERRAR AGORA FUNCIONA */}
                                        <button 
                                            className="btn btn-action" 
                                            style={{color:'#dc2626', borderColor:'#dc2626'}}
                                            onClick={() => handleEncerrarVaga(vaga.id)}
                                        >
                                            Encerrar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <hr style={{border:'0', borderTop:'1px solid #eee', marginBottom:'3rem'}} />

                {/* --- SECÇÃO 3: CURSOS --- */}
                <section id="cursos" style={{ scrollMarginTop: '100px' }}>
                    <h1>Cursos Cadastrados</h1>
                    <div className="card">
                        <div className="card-content">
                            {loading ? <p>Carregando...</p> : cursos.map(c => (
                                <div className="monitor-item" key={c.id}>
                                    <div className="monitor-info"><h5>{c.nome}</h5><p className="text-muted">{c.slug}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
export default TelaCoordenador;