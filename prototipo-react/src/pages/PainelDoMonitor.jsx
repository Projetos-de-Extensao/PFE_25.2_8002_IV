import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Layout.css';

function PainelDoMonitor() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [monitorias, setMonitorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonitorias = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('inscricoes')
                        .select(`
                            id,
                            status,
                            vagas ( unidade, disciplinas (nome) )
                        `)
                        .eq('user_id', user.id)
                        .eq('status', 'APROVADO'); // <--- FILTRO IMPORTANTE

                    if (error) throw error;
                    setMonitorias(data || []);
                }
            } catch (error) {
                console.error("Erro:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMonitorias();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><span className="material-icons">menu</span></button>
                <div className="system-title">Sistema de Monitoria <span>Monitor</span> <div className="user-avatar">MT</div></div>
            </header>
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">school</span> Área do Aluno</Link></li>
                        <li className="sidebar-nav-item active"><Link to="/painel-monitor"><span className="material-icons">book</span> Área do Monitor</Link></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Painel do Monitor</h1>
                <div className="stats-grid">
                    <div className="card"><p className="text-muted">Monitorias Ativas</p><div className="card-title">{monitorias.length}</div></div>
                </div>

                <h2>Minhas Turmas</h2>
                {loading && <p>Carregando...</p>}
                {!loading && monitorias.length === 0 && (
                    <div className="card"><div className="card-content"><p>Nenhuma monitoria ativa (Status APROVADO necessário).</p></div></div>
                )}

                {!loading && monitorias.map((item) => (
                    <div className="card disciplina-item" key={item.id}>
                        <div className="disciplina-header">
                            <h4>{item.vagas?.disciplinas?.nome}</h4>
                            <span className="badge bg-green">Ativo</span>
                        </div>
                        <p>Unidade: {item.vagas?.unidade}</p>
                        <div className="disciplina-details-grid">
                            <button className="btn btn-action">Frequência</button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
export default PainelDoMonitor;