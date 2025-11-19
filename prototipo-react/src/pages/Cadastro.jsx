import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css"; 

function Cadastro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    matricula: "",
    password: "",
    cursoSlug: ""
  });

  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/curso/')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        aluno: {
          matricula: formData.matricula,
          curso: formData.cursoSlug
        }
      };

      const response = await fetch('http://127.0.0.1:8000/api/cadastro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.email?.[0] || data.username?.[0] || data.aluno?.matricula?.[0] || "Erro ao realizar cadastro.";
        throw new Error(errorMsg);
      }

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate('/'); 

    } catch (err) {
      setError(err.message);
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
          <p>Preencha seus dados para acessar o sistema</p>

          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="firstName">Nome</label>
                <input name="firstName" type="text" required onChange={handleChange} placeholder="Seu nome" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="lastName">Sobrenome</label>
                <input name="lastName" type="text" required onChange={handleChange} placeholder="Sobrenome" />
                </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail Institucional</label>
              <input name="email" type="email" required onChange={handleChange} placeholder="@alunos.ibmec.edu.br" />
            </div>

            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input name="matricula" type="text" required onChange={handleChange} placeholder="Sua matrícula" />
            </div>

            <div className="form-group">
              <label htmlFor="cursoSlug">Curso</label>
              <select 
                name="cursoSlug" 
                required 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e1e1e1', background: '#f9f9f9' }}
              >
                <option value="">Selecione seu curso...</option>
                {cursos.map(curso => (
                    <option key={curso.id} value={curso.slug}>{curso.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input name="password" type="password" required onChange={handleChange} placeholder="Crie uma senha" />
            </div>

            {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

            <button type="submit" className="btn-entrar" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>

          <Link to="/" className="forgot-password">Já tem uma conta? Voltar ao Login</Link>
        </div>

        <div className="quick-access-panel">
          <h2>Junte-se a nós</h2>
          <p>Ao criar sua conta, você poderá:</p>
          
          <div className="profiles-grid" style={{ display: 'flex', flexDirection: 'column' }}>
             <div className="profile-card" style={{pointerEvents: 'none'}}>
                <span className="material-icons">school</span>
                <span>Inscrever-se em Monitorias</span>
             </div>
             <div className="profile-card" style={{pointerEvents: 'none'}}>
                <span className="material-icons">history_edu</span>
                <span>Acompanhar seu Histórico</span>
             </div>
             <div className="profile-card" style={{pointerEvents: 'none'}}>
                <span className="material-icons">badge</span>
                <span>Gerar Certificados</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cadastro;