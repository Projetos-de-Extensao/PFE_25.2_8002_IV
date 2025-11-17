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
                setError('Não está autenticado. Faça login primeiro.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/inscricao/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do aluno');
                }

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

    const toggleSidebar = () => {
        setIsSidebarOpen( !isSidebarOpen ); 
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={toggleSidebar}>☰</button>
                <img src="https://imgs.search.brave.com/KR-kQc-HcwSCeRhdARghFBBENq_TCf4ZU8Kw-Xun0Iw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZnJlZWJpZXN1cHBs/eS5jb20vbG9nb3Mv/bGFyZ2UvMngvaWJt/ZWMtZWR1Y2FjaW9u/YWwtcy1hLWxvZ28t/cG5nLXRyYW5zcGFy/ZW50LnBuZw"
                    alt="Logo Ibmec" className="ibmec-logo"/>
                <div className="system-title">
                    Sistema de Monitoria
                    <span>Aluno</span>
                    <span className="user-avatar">AL</span>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-nav-item active">
                            <a href="#inicio">Início</a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a href="#monitorias-disponiveis">Monitorias Disponíveis</a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a href="#candidatura-monitor">Candidatura para Monitor</a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a href="#minhas-disciplinas">Minhas Disciplinas</a>
                        </li>
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
                        <div className="card-header">
                            <h4>Suas Estatísticas de Monitoria</h4>
                        </div>
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
                                        <div className="card-title">12h</div>
                                    </div>
                                    <div className="card">
                                        <p className="text-muted">Média CR Atual</p>
                                        <div className="card-title">8.5</div>
                                    </div>
                                    <div className="card">
                                        <p className="text-muted">Aumento do CR</p>
                                        <div className="card-title" style={{ color: '#65a30d' }}>+0.8</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="candidatura-monitor">
                    <h2>Candidatura para Monitor</h2>
                    <div className="card">
                        <div className="card-header">
                            <h4>Qual o seu status como futuro monitor?</h4>
                        </div>
                        <div className="candidatura-card-content">
                            <div className="candidatura-stat">
                                <div className="candidatura-stat-value">8.5</div>
                                <div className="candidatura-stat-label">Seu CR</div>
                            </div>
                            <div className="candidatura-stat">
                                <div className="candidatura-stat-value">Possui</div>
                                <div className="candidatura-stat-label">CR Mínimo: 7.0</div>
                            </div>
                            <div className="candidatura-stat">
                                <div className="candidatura-stat-value">12h</div>
                                <div className="candidatura-stat-label">Experiência</div>
                            </div>
                        </div>
                        <ul className="requisitos-list">
                            <li><span className="icon-check">Preenche</span> Ter concluído a disciplina</li>
                            <li><span className="icon-check">Preenche</span> Ter cursado a disciplina com aprovação</li>
                            <li><span className="icon-x">Não Preenche</span> Disponibilidade de 20h/mês</li>
                        </ul>
                        <div className="candidatar-btn-container">
                            <button className="candidatar-btn">Candidatar-se para Monitor</button>
                        </div>
                    </div>
                </section>
                
                <section id="minhas-disciplinas">
                    <h2>Minhas Disciplinas</h2>
                    <div className="card disciplina-item">
                        <div className="disciplina-header">
                            <h4>Métodos Quantitativos</h4>
                            <div className="disciplina-badges">
                                <span className="badge bg-green">Aprovado</span>
                            </div>
                        </div>
                        <p className="text-muted text-small">IBM0113</p>
                        <div className="disciplina-horarios">
                            <span className="horario-badge">Disponível</span>
                            <span className="horario-badge">Amanhã 08:00</span>
                        </div>
                        <div className="disciplina-details-grid">
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Horário Aula</span>
                                <span className="disciplina-detail-value">Ter 08:00 - 09:40</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Professor(a)</span>
                                <span className="disciplina-detail-value">Luís Otávio</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Local</span>
                                <span className="disciplina-detail-value">Bloco - Ibmec</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Monitor(a)</span>
                                <span className="disciplina-detail-value">Ana Silva</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Sala</span>
                                <span className="disciplina-detail-value">Sala 101</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Nota Final</span>
                                <span className="disciplina-detail-value nota-final aprovado">9.5</span>
                            </div>
                        </div>
                    </div>
                    <div className="card disciplina-item">
                        <div className="disciplina-header">
                            <h4>Programação Orientada a Objetos</h4>
                            <div className="disciplina-badges">
                                <span className="badge bg-green">Aprovado</span>
                            </div>
                        </div>
                        <p className="text-muted text-small">IBM0215</p>
                        <div className="disciplina-horarios">
                            <span className="horario-badge">Disponível</span>
                            <span className="horario-badge">Ver Mais</span>
                        </div>
                        <div className="disciplina-details-grid">
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Horário Aula</span>
                                <span className="disciplina-detail-value">Ter 10:00 - 11:40</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Professor(a)</span>
                                <span className="disciplina-detail-value">Talita Ribeiro</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Local</span>
                                <span className="disciplina-detail-value">Bloco - Ibmec</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Monitor(a)</span>
                                <span className="disciplina-detail-value">Carlos Santos</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Sala</span>
                                <span className="disciplina-detail-value">Sala 103</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Nota Final</span>
                                <span className="disciplina-detail-value nota-final aprovado">8.8</span>
                            </div>
                        </div>
                    </div>
                    <div className="card disciplina-item">
                        <div className="disciplina-header">
                            <h4>Modelagem Computacional</h4>
                            <div className="disciplina-badges">
                                <span className="badge bg-green">Aprovado</span>
                            </div>
                        </div>
                        <p className="text-muted text-small">IBM0114</p>
                        <div className="disciplina-horarios">
                            <span className="horario-badge">Disponível</span>
                            <span className="horario-badge">Quinta 08:00</span>
                        </div>
                        <div className="disciplina-details-grid">
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Horário Aula</span>
                                <span className="disciplina-detail-value">Qui 08:00 - 09:40</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Professor(a)</span>
                                <span className="disciplina-detail-value">Danielle Gonçalves</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Local</span>
                                <span className="disciplina-detail-value">Bloco - Ibmec</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Monitor(a)</span>
                                <span className="disciplina-detail-value">Maria Costa</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Sala</span>
                                <span className="disciplina-detail-value">Sala 209</span>
                            </div>
                            <div className="disciplina-detail-item">
                                <span className="disciplina-detail-label">Nota Final</span>
                                <span className="disciplina-detail-value nota-final aprovado">9.0</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default PainelDoAluno;