import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);
    const [vagasDisponiveis, setVagasDisponiveis] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    // Função de Inscrição
    const handleInscricao = async (vagaId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert("Erro de usuário");

            // Verifica se já se inscreveu
            const jaInscrito = inscricoes.some(i => i.vagas.id === vagaId);
            if (jaInscrito) return alert("Você já se candidatou para esta vaga!");

            const { error } = await supabase.from('inscricoes').insert([{
                user_id: user.id,
                vaga_id: vagaId,
                status: 'PENDENTE'
            }]);

            if (error) throw error;
            alert("Inscrição realizada com sucesso! Aguarde a avaliação do professor.");
            window.location.reload();

        } catch (err) {
            alert("Erro ao inscrever: " + err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if(!user) return;

                // Perfil
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile) setUserRole(profile.role);

                // Minhas Inscrições
                const { data: minhas } = await supabase.from('inscricoes')
                    .select(`id, status, vagas ( id, unidade, disciplinas (nome) )`)
                    .eq('user_id', user.id);
                setInscricoes(minhas || []);

                // Vagas Disponíveis (Todas as abertas)
                const { data: vagas } = await supabase.from('vagas')
                    .select(`id, unidade, disciplinas (nome)`)
                    .eq('status', 'ABERTA');
                setVagasDisponiveis(vagas || []);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><span className="material-icons">menu</span></button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">Portal do Aluno <div className="user-avatar">AL</div></div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                         <li className="sidebar-nav-item active"><Link to="/painel-aluno"><span className="material-icons">home</span> Início</Link></li>
                         <li className="sidebar-nav-item"><Link to="/painel-monitor"><span className="material-icons">book</span> Área Monitor</Link></li>
                         {userRole === 'coord' && (
                             <li className="sidebar-nav-item"><Link to="/painel-coordenador" style={{color: '#d97706', fontWeight: 'bold'}}><span className="material-icons">business_center</span> Depto CASA</Link></li>
                         )}
                         <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}><a href="#" onClick={handleLogout} style={{color: '#dc2626'}}><span className="material-icons">logout</span> Sair</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={() => setIsSidebarOpen(false)}>
                <h1>Painel do Aluno</h1>
                
                {/* LISTA DE VAGAS DISPONÍVEIS (NOVO) */}
                <h2>Oportunidades de Monitoria</h2>
                <div className="card">
                    <div className="card-content">
                        {loading && <p>Carregando vagas...</p>}
                        {!loading && vagasDisponiveis.length === 0 && <p>Nenhuma vaga aberta no momento.</p>}
                        
                        {vagasDisponiveis.map(vaga => {
                            const jaInscrito = inscricoes.some(i => i.vagas.id === vaga.id);
                            return (
                                <div className="monitor-item" key={vaga.id}>
                                    <div className="monitor-info">
                                        <h5>{vaga.disciplinas?.nome}</h5>
                                        <p className="text-muted">Unidade: {vaga.unidade}</p>
                                    </div>
                                    {jaInscrito ? (
                                        <span className="badge bg-yellow">Já Inscrito</span>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => handleInscricao(vaga.id)}>
                                            Se Inscrever
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <h2>Minhas Candidaturas</h2>
                {!loading && inscricoes.map((item) => (
                    <div className="card disciplina-item" key={item.id}>
                        <div className="card-header">
                            <h4>{item.vagas?.disciplinas?.nome}</h4>
                            <span className={`badge ${item.status === 'APROVADO' ? 'bg-green' : 'bg-yellow'}`}>{item.status}</span>
                        </div>
                        <p>Unidade: {item.vagas?.unidade}</p>
                    </div>
                ))}
                {inscricoes.length === 0 && !loading && <p className="text-muted">Você não tem candidaturas ativas.</p>}
            </main>
        </div>
    );
}
export default PainelDoAluno;