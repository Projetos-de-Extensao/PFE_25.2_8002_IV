import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function TelaProfessores() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('apiToken');
        fetch('http://localhost:8000/api/inscricao/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(res => res.json())
        .then(data => setCandidatos(data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><span className="material-icons">menu</span></button>
                <div className="system-title">Sistema de Monitoria <span>Professor</span> <div className="user-avatar">PF</div></div>
            </header>
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-professor"><span className="material-icons">people</span> Seleção</Link></li>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">logout</span> Sair</Link></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Seleção de Monitores</h1>
                <div className="card">
                    <div className="card-header"><h4>Candidatos Pendentes</h4></div>
                    {candidatos.length === 0 ? <p style={{padding:'1rem'}}>Nenhum candidato visível.</p> : candidatos.map(c => (
                        <div className="monitor-item" key={c.id}>
                            <div className="monitor-info">
                                <h5>{c.nome_aluno || "Aluno"}</h5>
                                <p className="text-muted">Disciplina: {c.vaga.disciplina.nome}</p>
                                {c.arquivo_historico && <a href={c.arquivo_historico} target="_blank" className="text-small">Ver Histórico</a>}
                            </div>
                            <button className="btn btn-primary">Aprovar</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default TelaProfessores;