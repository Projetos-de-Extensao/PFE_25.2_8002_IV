import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function PainelDoMonitor() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [monitorias, setMonitorias] = useState([]);

    useEffect(() => {
        const fetchMonitorias = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('inscricoes')
                    .select(`status, vagas ( unidade, disciplinas (nome) )`)
                    .eq('user_id', user.id)
                    .eq('status', 'APROVADO');
                if(data) setMonitorias(data);
            }
        };
        fetchMonitorias();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="material-icons">menu</span>
                </button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">Área do Monitor <div className="user-avatar">MT</div></div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">school</span> Aluno</Link></li>
                        <li className="sidebar-nav-item active"><Link to="/painel-monitor"><span className="material-icons">book</span> Monitor</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Gestão de Monitoria</h1>
                <div className="stats-grid">
                    <div className="card">
                        <p className="text-muted">Turmas Ativas</p>
                        <div className="card-title">{monitorias.length}</div>
                    </div>
                </div>

                <h2>Minhas Turmas</h2>
                {monitorias.map((item, index) => (
                    <div className="card disciplina-item" key={index}>
                        <div className="card-header">
                            <h4>{item.vagas?.disciplinas?.nome}</h4>
                            <span className="badge bg-green">Ativo</span>
                        </div>
                        <p>Unidade: {item.vagas?.unidade}</p>
                        <div className="disciplina-details-grid">
                            <button className="btn btn-action">Registrar Frequência</button>
                        </div>
                    </div>
                ))}
                {monitorias.length === 0 && <p>Você não é monitor de nenhuma disciplina.</p>}
            </main>
        </div>
    );
}
export default PainelDoMonitor;