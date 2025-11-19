import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import './Layout.css';

function PainelDoAluno() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Dados
    const [inscricoes, setInscricoes] = useState([]);
    const [vagasDisponiveis, setVagasDisponiveis] = useState([]);
    
    // Perfil e Dados Acadêmicos
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("Aluno");
    const [userCurso, setUserCurso] = useState(null);
    
    const [dadosAcademicos, setDadosAcademicos] = useState({ 
        cr_geral: 0, 
        horas_cursadas: 0,
        nota_materia: 0 
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('apiToken');
        navigate('/');
    };

    // --- FUNÇÃO AUXILIAR: MUDANÇA COM LIMITE 10 ---
    const handleChangeNota = (e, campo) => {
        let valor = e.target.value;
        if (valor === '') {
            setDadosAcademicos({ ...dadosAcademicos, [campo]: '' });
            return;
        }
        // Converte para número para verificar o limite
        const numero = parseFloat(valor);
        if (numero > 10) {
            alert("O valor máximo permitido é 10.");
            valor = 10;
        }
        if (numero < 0) valor = 0;

        setDadosAcademicos({ ...dadosAcademicos, [campo]: valor });
    };

    // --- SALVAR DADOS ---
    const handleSalvarDados = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    cr_geral: parseFloat(dadosAcademicos.cr_geral), 
                    horas_cursadas: parseInt(dadosAcademicos.horas_cursadas),
                    nota_materia: parseFloat(dadosAcademicos.nota_materia)
                })
                .eq('id', user.id);

            if (error) throw error;
            alert("Dados acadêmicos atualizados com sucesso!");
        } catch (err) {
            alert("Erro ao salvar: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    // --- INSCRIÇÃO ---
    const handleInscricao = async (vagaId) => {
        try {
            // 1. Validação de Requisitos
            const cr = parseFloat(dadosAcademicos.cr_geral);
            const horas = parseInt(dadosAcademicos.horas_cursadas);
            const nota = parseFloat(dadosAcademicos.nota_materia);

            // MUDANÇA AQUI: Agora aceita >= 8.0
            if (cr < 8.0) {
                return alert("Requisito não atendido: Seu CR Geral deve ser maior ou igual a 8.0.");
            }
            if (horas < 800) {
                return alert("Requisito não atendido: Você precisa ter no mínimo 800 horas cursadas.");
            }
            if (nota <= 9.0) {
                return alert("Requisito não atendido: Sua nota nesta disciplina deve ser maior que 9.0.");
            }

            // 2. Inscrição
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert("Erro de usuário");

            const jaInscrito = inscricoes.some(i => i.vagas.id === vagaId);
            if (jaInscrito) return alert("Você já se candidatou para esta vaga!");

            const { error } = await supabase.from('inscricoes').insert([{
                user_id: user.id,
                vaga_id: vagaId,
                status: 'PENDENTE',
                nota_disciplina: nota
            }]);

            if (error) throw error;
            alert("Inscrição realizada com sucesso! Boa sorte.");
            window.location.reload();

        } catch (err) {
            alert("Erro: " + err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if(!user) return;

                // Buscar Perfil
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, first_name, last_name, curso_slug, cr_geral, horas_cursadas, nota_materia')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    setUserRole(profile.role);
                    setUserCurso(profile.curso_slug);
                    setUserName(profile.first_name ? `${profile.first_name} ${profile.last_name || ''}` : "Aluno");
                    setDadosAcademicos({
                        cr_geral: profile.cr_geral || 0,
                        horas_cursadas: profile.horas_cursadas || 0,
                        nota_materia: profile.nota_materia || 0
                    });
                }

                // Buscar Inscrições
                const { data: minhas } = await supabase.from('inscricoes')
                    .select(`id, status, vagas ( id, unidade, dia_semana, horario, disciplinas (nome) )`)
                    .eq('user_id', user.id);
                setInscricoes(minhas || []);

                // Buscar Vagas Disponíveis (Filtro de Curso)
                const { data: vagas } = await supabase.from('vagas')
                    .select(`id, unidade, dia_semana, horario, disciplinas (nome, cursos (slug))`)
                    .eq('status', 'ABERTA');
                
                if (vagas && profile) {
                    const vagasFiltradas = vagas.filter(v => {
                        const cursoDaVaga = v.disciplinas?.cursos?.slug;
                        return !cursoDaVaga || cursoDaVaga === profile.curso_slug;
                    });
                    setVagasDisponiveis(vagasFiltradas);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const minhasMonitoriasAtivas = inscricoes.filter(i => i.status === 'APROVADO');

    return (
        <div className={isSidebarOpen ? 'sidebar-open' : ''}>
            <header className="app-header">
                <button className="hamburger-menu" onClick={toggleSidebar}><span className="material-icons">menu</span></button>
                <img src={logo} alt="IBMEC" className="ibmec-logo" />
                <div className="system-title">
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', marginRight:'10px', lineHeight:'1.2'}}>
                        <strong>Portal do Aluno</strong>
                        <small style={{fontWeight:'normal', color:'#666', fontSize:'0.8rem'}}>{userName}</small>
                    </div>
                    <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                </div>
            </header>

            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                         <li className="sidebar-nav-item active"><Link to="/painel-aluno"><span className="material-icons">home</span> Início</Link></li>
                         <li className="sidebar-nav-item"><Link to="/painel-monitor"><span className="material-icons">book</span> Área Monitor</Link></li>
                         {userRole === 'coord' && (
                             <li className="sidebar-nav-item"><Link to="/painel-coordenador" style={{color: '#d97706', fontWeight: 'bold'}}><span className="material-icons">business_center</span> Depto CASA</Link></li>
                         )}
                         <li className="sidebar-nav-item" style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                             <a href="#" onClick={handleLogout} style={{color: '#dc2626'}}><span className="material-icons">logout</span> Sair</a>
                         </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content" onClick={closeSidebar}>
                <h1>Olá, {userName.split(' ')[0]}!</h1>
                
                <div className="stats-grid">
                    <div className="card">
                        <p className="text-muted">Inscrições</p>
                        <div className="card-title">{inscricoes.length}</div>
                    </div>
                    <div className="card">
                        <p className="text-muted">Curso</p>
                        <div className="card-title" style={{fontSize:'1.2rem', color:'#64748b', textTransform:'uppercase'}}>
                            {userCurso || '--'}
                        </div>
                    </div>
                </div>

                {/* --- CARD DE DADOS ACADÊMICOS --- */}
                <div className="card" style={{borderLeft: '5px solid #2563eb'}}>
                    <div className="card-header">
                        <h4>Meus Dados Acadêmicos</h4>
                        <span className="text-muted text-small">Mantenha atualizado para se candidatar</span>
                    </div>
                    <form onSubmit={handleSalvarDados} style={{display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                        
                        <div style={{flex: 1, minWidth: '150px'}}>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>CR Geral</label>
                            <input 
                                type="number" step="0.01" min="0" max="10"
                                className="form-control"
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
                                value={dadosAcademicos.cr_geral}
                                onChange={(e) => handleChangeNota(e, 'cr_geral')} // Usa a função com limite
                                placeholder="Ex: 8.5"
                            />
                        </div>

                        <div style={{flex: 1, minWidth: '150px'}}>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>Horas Cursadas</label>
                            <input 
                                type="number" min="0"
                                className="form-control"
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
                                value={dadosAcademicos.horas_cursadas}
                                onChange={(e) => setDadosAcademicos({...dadosAcademicos, horas_cursadas: e.target.value})}
                                placeholder="Ex: 850"
                            />
                        </div>

                        <div style={{flex: 1, minWidth: '150px'}}>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem', color:'#2563eb'}}>Nota na Matéria</label>
                            <input 
                                type="number" step="0.1" min="0" max="10"
                                className="form-control"
                                style={{width:'100%', padding:'10px', borderRadius:'8px', border:'2px solid #2563eb', backgroundColor:'#f0f9ff'}}
                                value={dadosAcademicos.nota_materia}
                                onChange={(e) => handleChangeNota(e, 'nota_materia')} // Usa a função com limite
                                placeholder="Ex: 9.5"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{height: '45px', minWidth:'100px'}}>
                            {saving ? '...' : 'Salvar'}
                        </button>
                    </form>
                    
                    <div style={{marginTop: '15px', padding:'10px', backgroundColor:'#f8fafc', borderRadius:'8px', fontSize: '0.85rem', color: '#555', border:'1px dashed #ccc'}}>
                        <strong>Requisitos Obrigatórios:</strong><br/>
                        • CR Geral &ge; 8.0 <br/>
                        • Horas Cursadas &ge; 800 <br/>
                        • Nota na Matéria Alvo &gt; 9.0 (Atualize este campo conforme a vaga que deseja!)
                    </div>
                </div>

                {/* AGENDA */}
                {minhasMonitoriasAtivas.length > 0 && (
                    <>
                        <h2>Minha Agenda</h2>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                            {minhasMonitoriasAtivas.map(m => (
                                <div key={m.id} className="card" style={{borderLeft: '5px solid #16a34a', display:'flex', flexDirection:'column', gap:'10px'}}>
                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                        <h4 style={{margin:0, color:'#003366'}}>{m.vagas.disciplinas.nome}</h4>
                                        <span className="badge bg-green">Monitor</span>
                                    </div>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#555'}}>
                                        <span className="material-icons" style={{color:'#2563eb'}}>event</span>
                                        <strong>{m.vagas.dia_semana}</strong>
                                    </div>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#555'}}>
                                        <span className="material-icons" style={{color:'#2563eb'}}>schedule</span>
                                        <span>{m.vagas.horario}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* OPORTUNIDADES */}
                <h2>Oportunidades na sua Área ({userCurso})</h2>
                <div className="card">
                    <div className="card-content">
                        {loading && <p>Carregando...</p>}
                        
                        {!loading && vagasDisponiveis.length === 0 && (
                            <div style={{textAlign:'center', padding:'1rem'}}>
                                <span className="material-icons" style={{fontSize:'3rem', color:'#ccc'}}>block</span>
                                <p>Nenhuma vaga disponível para o seu curso no momento.</p>
                            </div>
                        )}
                        
                        {vagasDisponiveis.map(vaga => {
                            const jaInscrito = inscricoes.some(i => i.vagas?.id === vaga.id);
                            return (
                                <div className="monitor-item" key={vaga.id}>
                                    <div className="monitor-info">
                                        <h5 style={{fontWeight:'bold'}}>{vaga.disciplinas?.nome}</h5>
                                        <p className="text-muted">{vaga.unidade} • {vaga.dia_semana} • {vaga.horario}</p>
                                    </div>
                                    {jaInscrito ? (
                                        <span className="badge bg-yellow">Inscrito</span>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => handleInscricao(vaga.id)}>
                                            Inscrever-se
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <h2>Histórico de Candidaturas</h2>
                {inscricoes.map(i => (
                    <div className="card disciplina-item" key={i.id}>
                        <div className="card-header">
                            <h4>{i.vagas?.disciplinas?.nome}</h4>
                            <span className={`badge ${i.status === 'APROVADO' ? 'bg-green' : i.status === 'REJEITADO' ? 'bg-red' : 'bg-yellow'}`}>
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