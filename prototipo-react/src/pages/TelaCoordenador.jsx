import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaCoordenador() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        const fetchDados = async () => {
            const { data } = await supabase.from('cursos').select('*');
            if (data) setCursos(data);
        };
        fetchDados();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="material-icons">menu</span>
                </button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">Coordenação CASA <div className="user-avatar">CS</div></div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-coordenador"><span className="material-icons">analytics</span> Dashboard</Link></li>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">logout</span> Sair</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Visão Geral</h1>
                <div className="stats-grid">
                    <div className="card">
                        <p className="text-muted">Cursos Ativos</p>
                        <div className="card-title">{cursos.length}</div>
                    </div>
                    <div className="card">
                        <p className="text-muted">Monitores Totais</p>
                        <div className="card-title">--</div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h4>Cursos</h4></div>
                    {cursos.map(c => (
                        <div className="monitor-item" key={c.id}>
                            <div className="monitor-info">
                                <h5>{c.nome}</h5>
                                <p className="text-muted">Código: {c.slug}</p>
                            </div>
                            <button className="btn btn-action">Detalhes</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default TelaCoordenador;