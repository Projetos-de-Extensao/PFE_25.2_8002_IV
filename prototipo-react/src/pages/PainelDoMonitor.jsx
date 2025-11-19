import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function PainelDoMonitor() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [monitorias, setMonitorias] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('apiToken');
        fetch('http://localhost:8000/api/inscricao/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            const aprovadas = data.filter(i => i.status === 'CANDIDATURA APROVADA' || i.status === 'APROVADO');
            setMonitorias(aprovadas);
        })
        .catch(err => console.error(err));
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
                {monitorias.length === 0 ? <div className="card"><p>Nenhuma monitoria ativa.</p></div> : monitorias.map(m => (
                    <div className="card" key={m.id}>
                        <div className="card-header"><h4>{m.vaga.disciplina.nome}</h4><span className="badge bg-green">Ativo</span></div>
                        <div className="disciplina-details-grid"><button className="btn btn-action">Frequência</button></div>
                    </div>
                ))}
            </main>
        </div>
    );
}
export default PainelDoMonitor;