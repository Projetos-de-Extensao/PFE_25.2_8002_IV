import { useState } from "react";
import "./App.css"; // 

function App() {
  // Lógica do React: Controla se a sidebar está aberta ou fechada
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    // O CSS vai olhar se essa div tem a classe "sidebar-open"
    <div className={`app-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* HEADER */}
      <header className="app-header">
        <button className="hamburger-menu" onClick={toggleSidebar}>
          ☰
        </button>

        <img
          src="https://imgs.search.brave.com/KR-kQc-HcwSCeRhdARghFBBENq_TCf4ZU8Kw-Xun0Iw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZnJlZWJpZXN1cHBs/eS5jb20vbG9nb3Mv/bGFyZ2UvMngvaWJt/ZWMtZWR1Y2FjaW9u/YWwtcy1hLWxvZ28t/cG5nLXRyYW5zcGFy/ZW50LnBuZw"
          alt="Logo Ibmec"
          className="ibmec-logo"
        />

        <div className="system-title-container">
          <div className="system-title-main">Sistema de Monitoria</div>
          <div className="system-title-sub text-muted">Coordenador</div>
        </div>

        <div className="header-spacer"></div>

        <div className="header-right-items">
          <button className="header-icon-btn">
            <span className="material-icons-outlined">notifications</span>
          </button>
          <div className="header-user-profile">
            <div className="user-avatar">G</div>
            <div className="user-details">
              <span className="user-name">Gianluca Leonardi</span>
              <span className="user-period text-muted">Período 2025.2</span>
            </div>
          </div>
        </div>

        <div className="system-title">
          Sistema de Monitoria
          <span>Coordenador</span>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <li className="sidebar-nav-item active">
            <a href="#inicio" onClick={closeSidebar}>
              <span className="material-icons-outlined">book</span>
              <span>Início</span>
            </a>
          </li>
          <li className="sidebar-nav-item">
            <a href="#processos" onClick={closeSidebar}>
              <span className="material-icons-outlined">calendar_today</span>
              <span>Processos Seletivos</span>
            </a>
          </li>
          <li className="sidebar-nav-item">
            <a href="#monitores" onClick={closeSidebar}>
              <span className="material-icons-outlined">person_outline</span>
              <span>Gerenciar Monitores</span>
            </a>
          </li>
          <li className="sidebar-nav-item">
            <a href="#usuarios" onClick={closeSidebar}>
              <span className="material-icons-outlined">people_outline</span>
              <span>Gerenciar Usuários</span>
            </a>
          </li>
          <li className="sidebar-nav-item">
            <a href="#relatorios" onClick={closeSidebar}>
              <span className="material-icons-outlined">article</span>
              <span>Relatórios Globais</span>
            </a>
          </li>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      {/* O onClick aqui serve para fechar o menu se clicar fora (no mobile) */}
      <main className="main-content" onClick={closeSidebar}>
        <h1>Painel do Coordenador</h1>

        <div className="stats-grid">
          <div className="card">
            <p className="text-muted">Monitores Ativos</p>
            <div className="card-title">42</div>
          </div>
          <div className="card">
            <p className="text-muted">Candidatos Pendentes</p>
            <div className="card-title">18</div>
          </div>
          <div className="card">
            <p className="text-muted">Processos Abertos</p>
            <div className="card-title">5</div>
          </div>
          <div className="card">
            <p className="text-muted">Professores na Plataforma</p>
            <div className="card-title">27</div>
          </div>
        </div>

        <h2>Ações Rápidas</h2>
        <div className="quick-actions-grid">
          <a href="#novo" className="btn btn-primary">
            <span>Criar Novo Processo Seletivo</span>
          </a>
          <a href="#relatorio" className="btn">
            <span>Gerar Relatório Geral</span>
          </a>
          <a href="#professores" className="btn">
            <span>Gerenciar Professores</span>
          </a>
        </div>

        <h2>Atividades Recentes</h2>
        <div className="card">
          <div className="card-header">
            <h4>Aprovações Pendentes</h4>
          </div>
          <div className="card-content">
            <p>Não há aprovações pendentes no momento.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
