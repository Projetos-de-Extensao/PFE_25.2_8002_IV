import React, { useState, useEffect } from 'react';
import './PainelDoAluno.css';

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDadosDoAluno = async () => {
            const token = localStorage.getItem('apiToken');
            if (!token) {
                setError('Não está autenticado.');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/api/inscricao/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao carregar dados');
                const data = await response.json();
                setInscricoes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDadosDoAluno();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);
    
    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={toggleSidebar}>☰</button>
                <img src="https://imgs.search.brave.com/KR-kQc-HcwSCeRhdARghFBBENq_TCf4ZU8Kw-Xun0Iw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZnJlZWJpZXN1cHBs/eS5jb20vbG9nb3Mv/bGFyZ2UvMngvaWJt/ZWMtZWR1Y2FjaW9u/YWwtcy1hLWxvZ28t/cG5nLXRyYW5zcGFy/ZW50LnBuZw"
                    alt="Logo Ibmec" className="ibmec-logo"/>
                <div className="system-title">
                    Sistema de Monitoria<span>Aluno</span><span className="user-avatar">AL</span>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active"><a href="#inicio">Início</a></li>
                        <li className="sidebar-nav-item"><a href="#monitorias-disponiveis">Monitorias Disponíveis</a></li>
                        <li className="sidebar-nav-item"><a href="#candidatura-monitor">Candidatura para Monitor</a></li>
                        <li className="sidebar-nav-item"><a href="#minhas-disciplinas">Minhas Disciplinas</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={closeSidebar}>
                <section id="inicio">
                    <h1>Painel do Aluno</h1>
                    <p className="text-muted">Acompanhe suas monitorias, disciplinas e oportunidades</p>
                </section>

                <section id="monitorias-disponiveis">
                    <h2>Dashboard de Desempenho</h2>
                    <div className="card">
                        <div className="card-header"><h4>Suas Estatísticas de Monitoria</h4></div>
                        <div className="card-content">
                            {loading && <p>A carregar dados...</p>}
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            {!loading && !error && (
                                <div className="stats-grid">
                                    <div className="card">
                                        <p className="text-muted">Inscrições Feitas</p>
                                        <div className="card-title">{inscricoes.length}</div>
                                    </div>
                                    <div className="card">
                                        <p className="text-muted">Horas de Monitoria</p>
                                        <div className="card-title">0h</div>
                                    </div>
                                    <div className="card">
                                        <p className="text-muted">Média CR Atual</p>
                                        <div className="card-title">--</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="minhas-disciplinas">
                    <h2>Minhas Disciplinas</h2>
                    {loading && <p>Carregando disciplinas...</p>}
                    {!loading && !error && inscricoes.length === 0 && <p>Você ainda não tem inscrições.</p>}
                    
                    {!loading && !error && inscricoes.map((inscricao) => (
                        <div className="card disciplina-item" key={inscricao.id}>
                            <div className="disciplina-header">
                                <h4>{inscricao.vaga.disciplina.nome}</h4>
                                <div className="disciplina-badges">
                                    <span className="badge bg-green">{inscricao.status}</span>
                                </div>
                            </div>
                            <p className="text-muted text-small">Unidade: {inscricao.vaga.unidade}</p>
                            <div className="disciplina-details-grid">
                                <div className="disciplina-detail-item">
                                    <span className="disciplina-detail-label">Vaga ID</span>
                                    <span className="disciplina-detail-value">{inscricao.vaga.id}</span>
                                </div>
                                <div className="disciplina-detail-item">
                                    <span className="disciplina-detail-label">Aluno</span>
                                    <span className="disciplina-detail-value">{inscricao.nome_aluno}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default PainelDoAluno;