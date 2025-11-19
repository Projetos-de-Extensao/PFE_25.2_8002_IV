import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('apiToken');
        fetch('http://localhost:8000/api/inscricao/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(res => res.json())
        .then(data => setInscricoes(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><span className="material-icons">menu</span></button>
                <div className="system-title">Sistema de Monitoria <span>Aluno</span> <div className="user-avatar">AL</div></div>
            </header>
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-aluno"><span className="material-icons">home</span> Início</Link></li>
                        <li className="sidebar-nav-item"><Link to="/painel-monitor"><span className="material-icons">book</span> Área do Monitor</Link></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Painel do Aluno</h1>
                <div className="stats-grid">
                    <div className="card"><p className="text-muted">Inscrições Feitas</p><div className="card-title">{inscricoes.length}</div></div>
                    <div className="card"><p className="text-muted">Média CR</p><div className="card-title">--</div></div>
                </div>
                <h2>Minhas Inscrições</h2>
                {loading && <p>Carregando...</p>}
                {!loading && inscricoes.map(i => (
                    <div className="card" key={i.id}>
                        <div className="card-header"><h4>{i.vaga.disciplina.nome}</h4><span className="badge bg-yellow">{i.status}</span></div>
                        <p>Unidade: {i.vaga.unidade}</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
export default PainelDoAluno;