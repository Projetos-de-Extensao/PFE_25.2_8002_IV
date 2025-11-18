import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css"; 

function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: matricula, 
          password: senha
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors || 'Dados inválidos');
      }

      localStorage.setItem('apiToken', data.token);
      navigate('/painel-aluno');

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }; 

  return (
    <div className="body-wrapper"> 
      <div className="login-container">
        <div className="login-panel">
          <div className="system-logo">
          </div>
          <h1>Bem-vindo!</h1>
          <p>Acesse sua conta para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
                placeholder="Sua matrícula"
              />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="********"
              />
            </div>
            {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
            <button type="submit" className="btn-entrar">Entrar</button>
          </form>
          <a href="#" className="forgot-password">Esqueceu sua senha?</a>
        </div>
        <div className="quick-access-panel">
          <h2>Acesso Rápido</h2>
          <p>Selecione seu perfil para acessar (demo)</p>
          <div className="profiles-grid">
             <a href="#" className="profile-card"><span className="material-icons">person</span>Aluno</a>
             <a href="#" className="profile-card"><span className="material-icons">book</span>Monitor</a>
             <a href="#" className="profile-card"><span className="material-icons">school</span>Professor</a>
             <a href="#" className="profile-card"><span className="material-icons">business_center</span>Coordenação</a>
          </div>
          <a href="#" className="first-access-btn">Primeiro acesso? Cadastre-se aqui</a>
        </div>
      </div>
    </div>
  );
}

export default Login;