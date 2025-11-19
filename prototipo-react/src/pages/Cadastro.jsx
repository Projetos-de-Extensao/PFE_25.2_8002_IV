import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import "./Login.css"; 

function Cadastro() {
  const navigate = useNavigate();
  
  // Adicionado o campo 'role' (perfil)
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    matricula: "", 
    password: "", 
    cursoSlug: "",
    role: "aluno" // Valor padrão
  });

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
        const { data } = await supabase.from('cursos').select('*');
        if(data) setCursos(data);
    }
    fetchCursos();
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = formData.email.toLowerCase();
    const role = formData.role;

    // --- REGRAS DE VALIDAÇÃO DE E-MAIL ---
    
    // 1. Regra para Alunos e Monitores
    if ((role === 'aluno' || role === 'monitor') && !email.endsWith("@alunos.ibmec.edu.br")) {
        alert("Alunos e Monitores devem usar o e-mail: @alunos.ibmec.edu.br");
        return;
    }

    // 2. Regra para Professores
    if (role === 'professor' && !email.endsWith("@professores.ibmec.edu.br")) {
        alert("Professores devem usar o e-mail: @professores.ibmec.edu.br");
        return;
    }

    // 3. Regra para CASA (Coordenação)
    if (role === 'coord' && !email.endsWith("@ibmec.edu.br")) {
        alert("Membros da CASA devem usar o e-mail: @ibmec.edu.br");
        return;
    }
    
    // -------------------------------------

    setLoading(true);

    try {
      // 1. Cria o login
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (data.user) {
        // 2. Salva os dados com o PERFIL (role) correto
        const { error: profileError } = await supabase.from('profiles').upsert([{
            id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            matricula: formData.matricula,
            email: formData.email,
            curso_slug: formData.cursoSlug,
            role: formData.role // Salva se é aluno, prof, etc.
        }]);
        
        if (profileError) throw profileError;
      }

      alert("Cadastro realizado com sucesso! Faça login.");
      navigate('/'); 

    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-visual">
          <div className="visual-content">
            <h2>Bem-vindo à<br/>Comunidade</h2>
            <p style={{marginTop: '1rem'}}>
              Crie sua conta para acessar monitorias, histórico e conectar-se com a coordenação.
            </p>
          </div>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            <img src={logo} alt="Logo IBMEC" className="login-logo" />
            <h3>Criar Conta</h3>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* NOVO CAMPO: SELEÇÃO DE PERFIL */}
            <div className="input-group">
                <label>Eu sou:</label>
                <select name="role" value={formData.role} onChange={handleChange} required style={{fontWeight: 'bold', color: '#003366'}}>
                    <option value="aluno">Aluno</option>
                    <option value="monitor">Monitor</option>
                    <option value="professor">Professor</option>
                    <option value="coord">Colaborador CASA</option>
                </select>
            </div>

            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Nome</label>
                    <input name="firstName" onChange={handleChange} required placeholder="Nome" />
                </div>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Sobrenome</label>
                    <input name="lastName" onChange={handleChange} required placeholder="Sobrenome" />
                </div>
            </div>

            <div className="input-group">
                <label>E-mail Institucional</label>
                <input name="email" type="email" onChange={handleChange} required placeholder="Confira a regra do seu perfil" />
            </div>

            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Matrícula / ID</label>
                    <input name="matricula" onChange={handleChange} required placeholder="Nº de Matrícula" />
                </div>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Curso / Depto</label>
                    <select name="cursoSlug" onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {cursos.map(c => <option key={c.id} value={c.slug}>{c.nome}</option>)}
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label>Senha</label>
                <input name="password" type="password" onChange={handleChange} required placeholder="Crie uma senha forte" />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Criando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/">Já tem uma conta? <strong>Fazer Login</strong></Link>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Cadastro;