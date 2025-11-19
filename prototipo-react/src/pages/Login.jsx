import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';
import "./Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) throw error;

      localStorage.setItem('apiToken', data.session.access_token);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
          navigate('/painel-aluno');
          return;
      }

      // Redirecionamento (Monitor removido -> vai para aluno)
      switch (profile.role) {
          case 'coord': navigate('/painel-coordenador'); break;
          case 'professor': navigate('/painel-professor'); break;
          default: navigate('/painel-aluno');
      }

    } catch (err) {
      setError("Erro: Verifique seu e-mail e senha.");
    }
  }; 

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-visual">
          <div className="visual-content">
            <h2>Bem-vindo ao <br/>Portal Acadêmico</h2>
            <p style={{marginTop: '1rem'}}>
              Acesse seu ambiente personalizado de acordo com seu perfil.
            </p>
          </div>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            <img src={logo} alt="Logo IBMEC" className="login-logo" />
            <h3>Acesse sua conta</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>E-mail Institucional</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                required placeholder="ex: usuario@ibmec.edu.br" 
              />
            </div>
            <div className="input-group">
              <label>Senha</label>
              <input 
                type="password" value={senha} onChange={(e) => setSenha(e.target.value)} 
                required placeholder="••••••••" 
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn-login">Entrar</button>
          </form>

          <div className="login-footer">
            <Link to="/cadastro">Primeiro acesso? <strong>Cadastre-se</strong></Link>
            
            <div className="dev-links-login">
                <small>Atalhos (Dev):</small> 
                <Link to="/painel-aluno">Aluno</Link> • 
                <Link to="/painel-professor">Prof.</Link> • 
                <Link to="/painel-coordenador">CASA</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;