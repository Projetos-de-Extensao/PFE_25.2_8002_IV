import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp'; // Importa a logo
import './Layout.css'; // Usa o layout geral

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user) return;

            const { data } = await supabase
                .from('inscricoes')
                .select(`status, vagas ( unidade, disciplinas (nome) )`)
                .eq('user_id', user.id);
            
            if (data) setInscricoes(data);
        };
        fetchData();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="material-icons">menu</span>
                </button>
                
                {/* LOGO OFICIAL AQUI */}
                <img src={logo} alt="IBMEC" className="ibmec-logo" />

                <div className="system-title">
                    Portal do Aluno <div className="user-avatar">AL</div>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                         <li className="sidebar-nav-item active">
                            <Link to="/painel-aluno"><span className="material-icons">home</span> Início</Link>
                         </li>
                         <li className="sidebar-nav-item">
                            <Link to="/painel-monitor"><span className="material-icons">book</span> Área Monitor</Link>
                         </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Meus Estudos</h1>
                
                <div className="stats-grid">
                    <div className="card">
                        <p className="text-muted">Inscrições</p>
                        <div className="card-title">{inscricoes.length}</div>
                    </div>
                    <div className="card">
                        <p className="text-muted">Coeficiente</p>
                        <div className="card-title">--</div>
                    </div>
                </div>

                <h2>Minhas Monitorias</h2>
                {inscricoes.length === 0 && <div className="card"><p>Nenhuma inscrição ativa.</p></div>}
                
                {inscricoes.map((i, index) => (
                    <div className="card disciplina-item" key={index}>
                        <div className="card-header">
                            <h4>{i.vagas?.disciplinas?.nome}</h4>
                            <span className={`badge ${i.status === 'APROVADO' ? 'bg-green' : 'bg-yellow'}`}>
                                {i.status}
                            </span>
                        </div>
                        <p>Unidade: {i.vagas?.unidade}</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
export default PainelDoAluno;