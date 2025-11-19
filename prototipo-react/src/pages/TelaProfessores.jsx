import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaProfessores() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    const fetchCandidatos = async () => {
        setLoading(true);
        try {
            // Busca inscrições pendentes com detalhes
            const { data, error } = await supabase
                .from('inscricoes')
                .select(`
                    id, status, arquivo_url,
                    profiles:user_id ( first_name, last_name, matricula ),
                    vagas ( unidade, disciplinas (nome) )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCandidatos(data || []);
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
            alert("Erro ao atualizar: " + err.message);
        }
    };

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><span className="material-icons">menu</span></button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">Portal do Professor <div className="user-avatar">PF</div></div>
            </header>
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-professor"><span className="material-icons">people</span> Seleção de Monitores</Link></li>
                        <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}><a href="#" onClick={handleLogout} style={{color: '#dc2626'}}><span className="material-icons">logout</span> Sair</a></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Seleção de Monitores</h1>
                <div className="card">
                    <div className="card-header"><h4>Candidatos Pendentes</h4></div>
                    
                    {loading && <p style={{padding:'1rem'}}>Carregando...</p>}
                    {!loading && candidatos.length === 0 && <p style={{padding:'1rem'}}>Nenhum candidato pendente.</p>}

                    {!loading && candidatos.map(c => (
                        <div className="monitor-item" key={c.id}>
                            <div className="monitor-info">
                                <h5>{c.profiles?.first_name} {c.profiles?.last_name} ({c.profiles?.matricula})</h5>
                                <p className="text-muted">{c.vagas?.disciplinas?.nome} - {c.vagas?.unidade}</p>
                                <p className="text-small">Status Atual: <strong style={{color: c.status === 'APROVADO' ? 'green' : 'orange'}}>{c.status}</strong></p>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {c.status === 'PENDENTE' && (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleDecisao(c.id, 'APROVADO')}>Aprovar</button>
                                        <button className="btn btn-action" onClick={() => handleDecisao(c.id, 'REJEITADO')}>Rejeitar</button>
                                    </>
                                )}
                                {c.status !== 'PENDENTE' && <span className="badge bg-gray">Decidido</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default TelaProfessores;