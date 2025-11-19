import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Layout.css';

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInscricoes = async () => {
            try {
                // 1. Pega o usuário logado
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    // 2. Busca inscrições + dados da vaga + nome da disciplina
                    const { data, error } = await supabase
                        .from('inscricoes')
                        .select(`
                            id,
                            status,
                            vagas (
                                unidade,
                                disciplinas (nome)
                            )
                        `)
                        .eq('user_id', user.id); // Filtra só as minhas

                    if (error) throw error;
                    setInscricoes(data || []);
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInscricoes();
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
                {!loading && inscricoes.length === 0 && (
                    <div className="card"><div className="card-content"><p>Você ainda não se inscreveu em nenhuma vaga.</p></div></div>
                )}
                
                {!loading && inscricoes.map((item) => (
                    <div className="card" key={item.id}>
                        <div className="card-header">
                            {/* Acessa dados aninhados (vagas -> disciplinas -> nome) */}
                            <h4>{item.vagas?.disciplinas?.nome || "Disciplina"}</h4>
                            <span className={`badge ${item.status === 'APROVADO' ? 'bg-green' : 'bg-yellow'}`}>
                                {item.status}
                            </span>
                        </div>
                        <p>Unidade: {item.vagas?.unidade}</p>
                    </div>
                ))}
            </main>
        </div>
    );
}
export default PainelDoAluno;