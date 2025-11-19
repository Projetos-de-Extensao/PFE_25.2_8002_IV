import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Layout.css';

function TelaProfessores() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função para buscar dados
    const fetchCandidatos = async () => {
        setLoading(true);
        try {
            // Busca TODAS as inscrições + dados do aluno (profile)
            const { data, error } = await supabase
                .from('inscricoes')
                .select(`
                    id,
                    status,
                    arquivo_url,
                    user_id,
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

    useEffect(() => {
        fetchCandidatos();
    }, []);

    // Função para Aprovar/Rejeitar
    const handleDecisao = async (id, novaDecisao) => {
        try {
            const { error } = await supabase
                .from('inscricoes')
                .update({ status: novaDecisao })
                .eq('id', id);

            if (error) throw error;
            
            alert(`Candidato ${novaDecisao}!`);
            fetchCandidatos(); // Recarrega a lista
        } catch (err) {
            alert("Erro ao atualizar: " + err.message);
        }
    };

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
                    
                    {loading && <p style={{padding:'1rem'}}>Carregando...</p>}
                    {!loading && candidatos.length === 0 && <p style={{padding:'1rem'}}>Nenhum candidato.</p>}

                    {!loading && candidatos.map(c => (
                        <div className="monitor-item" key={c.id}>
                            <div className="monitor-info">
                                {/* Exibe Nome + Sobrenome */}
                                <h5>{c.profiles?.first_name} {c.profiles?.last_name} ({c.profiles?.matricula})</h5>
                                <p className="text-muted">Disciplina: {c.vagas?.disciplinas?.nome} - {c.vagas?.unidade}</p>
                                <p className="text-small">Status: <span className="badge bg-yellow">{c.status}</span></p>
                                {c.arquivo_url && <a href={c.arquivo_url} target="_blank" className="text-small" style={{color: '#2563eb'}}>Ver PDF</a>}
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button className="btn btn-primary" onClick={() => handleDecisao(c.id, 'APROVADO')}>Aprovar</button>
                                <button className="btn btn-action" onClick={() => handleDecisao(c.id, 'REJEITADO')}>Rejeitar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default TelaProfessores;