import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function TelaCoordenador() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/curso/')
            .then(res => res.json())
            .then(data => setCursos(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="material-icons">menu</span>
                </button>
                <div className="system-title">Sistema de Monitoria <span>CASA</span> <div className="user-avatar">CS</div></div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-coordenador"><span className="material-icons">analytics</span> Dashboard</Link></li>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">logout</span> Sair</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Visão Geral da CASA</h1>
                
                <div className="stats-grid">
                    <div className="card">
                        <p className="text-muted">Cursos Ativos</p>
                        <div className="card-title">{cursos.length}</div>
                    </div>
                    <div className="card">
                        <p className="text-muted">Total de Monitores</p>
                        <div className="card-title">--</div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h4>Cursos Cadastrados</h4></div>
                    <div>
                        {cursos.map(c => (
                            <div key={c.id} className="monitor-item">
                                <div className="monitor-info">
                                    <h5>{c.nome}</h5>
                                    <p className="text-muted">Slug: {c.slug}</p>
                                </div>
                                <button className="btn btn-action">Ver Detalhes</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TelaCoordenador;