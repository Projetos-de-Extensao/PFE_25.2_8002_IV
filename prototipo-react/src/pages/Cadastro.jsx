import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import "./Login.css"; 

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", matricula: "", password: "", cursoSlug: "" });
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Busca cursos do Supabase
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
    setLoading(true);

    try {
      // 1. Criar usuário no Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;

      // 2. Salvar perfil no banco
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert([{
            id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            matricula: formData.matricula,
            email: formData.email,
            curso_slug: formData.cursoSlug
        }]);
        if (profileError) throw profileError;
      }

      alert("Conta criada com sucesso! Faça login.");
      navigate('/'); 

    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="body-wrapper">
        <div className="login-container">
            <div className="login-panel">
                <div className="system-logo"></div>
                <h1>Criar Conta</h1>
                <p>Preencha seus dados acadêmicos</p>
                <form onSubmit={handleSubmit}>
                    <div style={{display:'flex', gap:'10px'}}>
                        <div className="form-group" style={{flex:1}}>
                            <label>Nome</label>
                            <input name="firstName" onChange={handleChange} required placeholder="Seu nome"/>
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>Sobrenome</label>
                            <input name="lastName" onChange={handleChange} required placeholder="Sobrenome"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>E-mail Institucional</label>
                        <input name="email" type="email" onChange={handleChange} required placeholder="@alunos.ibmec.edu.br"/>
                    </div>
                    <div className="form-group">
                        <label>Matrícula</label>
                        <input name="matricula" onChange={handleChange} required placeholder="2025..." />
                    </div>
                    <div className="form-group">
                        <label>Curso</label>
                        <select name="cursoSlug" onChange={handleChange} required style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}}>
                            <option value="">Selecione...</option>
                            {cursos.map(c => <option key={c.id} value={c.slug}>{c.nome}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input name="password" type="password" onChange={handleChange} required placeholder="******"/>
                    </div>
                    <button type="submit" className="btn-entrar" disabled={loading}>
                        {loading ? 'Criando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to="/" className="forgot-password">Já tem conta? Voltar</Link>
            </div>
            
            <div className="quick-access-panel">
                <h2>Sistema Acadêmico</h2>
                <p>Junte-se aos monitores e professores.</p>
                <div className="profiles-grid">
                    <div className="profile-card"><span className="material-icons">school</span></div>
                    <div className="profile-card"><span className="material-icons">book</span></div>
                </div>
            </div>
        </div>
    </div>
  );
}
export default Cadastro;