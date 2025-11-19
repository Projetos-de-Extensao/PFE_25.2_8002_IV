import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function TelaProfessores() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);

    const fetchCandidatos = async () => {
        const { data } = await supabase
            .from('inscricoes')
            .select(`id, status, arquivo_url, profiles(first_name, last_name, matricula), vagas(unidade, disciplinas(nome))`)
            .order('created_at', { ascending: false });
        if (data) setCandidatos(data);
    };

    useEffect(() => { fetchCandidatos(); }, []);

    const handleDecisao = async (id, status) => {
        await supabase.from('inscricoes').update({ status }).eq('id', id);
        fetchCandidatos();
    };

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="material-icons">menu</span>
                </button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">Portal do Professor <div className="user-avatar">PF</div></div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><Link to="/painel-professor"><span className="material-icons">people</span> Seleção</Link></li>
                        <li className="sidebar-nav-item"><Link to="/painel-aluno"><span className="material-icons">logout</span> Sair</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Seleção de Monitores</h1>
                <div className="card">
                    <div className="card-header"><h4>Candidatos Pendentes</h4></div>
                    
                    {candidatos.map(c => (
                        <div className="monitor-item" key={c.id}>
                            <div className="monitor-info">
                                <h5>{c.profiles?.first_name} {c.profiles?.last_name}</h5>
                                <p>{c.vagas?.disciplinas?.nome} ({c.vagas?.unidade})</p>
                                <p className="text-small">Status: <span className="badge bg-yellow">{c.status}</span></p>
                            </div>
                            <div style={{display:'flex', gap:'10px'}}>
                                <button className="btn btn-primary" onClick={() => handleDecisao(c.id, 'APROVADO')}>Aprovar</button>
                                <button className="btn btn-action" onClick={() => handleDecisao(c.id, 'REJEITADO')}>Rejeitar</button>
                            </div>
                        </div>
                    ))}
                    {candidatos.length === 0 && <p style={{padding:'1rem'}}>Nenhum candidato.</p>}
                </div>
            </main>
        </div>
    );
}
export default TelaProfessores;