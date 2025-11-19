import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import "./Login.css";

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", matricula: "", password: "", cursoSlug: "" });
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
    
    // Validação de Domínio
    if (!formData.email.toLowerCase().endsWith("@alunos.ibmec.edu.br")) {
        alert("Use seu e-mail institucional (@alunos.ibmec.edu.br)");
        return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;

      if (data.user) {
        // Usa UPSERT para evitar erro de duplicidade se tentar de novo
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

      alert("Cadastro realizado! Faça login.");
      navigate('/'); 

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* LADO ESQUERDO: Visual (some no mobile) */}
        <div className="login-visual">
          <div className="visual-content">
            <h2>Junte-se à<br/>Comunidade</h2>
            <p style={{marginTop: '1rem'}}>
              Crie sua conta para acessar monitorias, histórico e conectar-se com professores.
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="login-form-container">
          <div className="form-header">
            <img src={logo} alt="Logo IBMEC" className="login-logo" />
            <h3>Criar Conta</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Nome</label>
                    <input name="firstName" onChange={handleChange} required placeholder="Seu nome" />
                </div>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Sobrenome</label>
                    <input name="lastName" onChange={handleChange} required placeholder="Sobrenome" />
                </div>
            </div>

            <div className="input-group">
                <label>E-mail Institucional</label>
                <input name="email" type="email" onChange={handleChange} required placeholder="@alunos.ibmec.edu.br" />
            </div>

            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Matrícula</label>
                    <input name="matricula" onChange={handleChange} required placeholder="2025..." />
                </div>
                <div className="input-group" style={{flex: '1 1 45%'}}>
                    <label>Curso</label>
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