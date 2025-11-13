import React, { useState } from "react";
import "./Login.css"; 



  function Login(e) {
    e.preventDefault();
    console.log("Entrar com:", { email, senha });
   

  return (
    <div className="body-wrapper"> 
      <div className="login-container">
        
       
        <div className="login-panel">
          <div className="system-logo">
            <img src={logoSrc} alt="Logo" />
          </div>

          <h1>Bem-vindo!</h1>
          <p>Acesse sua conta para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu.email@instituicao.edu.br"
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="btn-entrar"
            >
              Entrar
            </button>
          </form>

          <a href="#" className="forgot-password">
            Esqueceu sua senha?
          </a>
        </div>


        <div className="quick-access-panel">
          <h2>Acesso Rápido</h2>
          <p>Selecione seu perfil para acessar (demo)</p>

          <div className="profiles-grid">
            <a href="paineldoaluno.html" className="profile-card">
              <span className="material-icons">person</span>
              Aluno
            </a>

            <a href="paineldoaluno_IDprof.html" className="profile-card">
              <span className="material-icons">book</span>
              Monitor
            </a>

            <a href="telaprofessores.html" className="profile-card">
              <span className="material-icons">school</span>
              Professor
            </a>

            <a href="telacoordenador (1).html" className="profile-card">
              <span className="material-icons">business_center</span>
              Coordenação
            </a>
          </div>

          <a href="#" className="first-access-btn">
            Primeiro acesso? Cadastre-se aqui
          </a>
        </div>
      </div>
    </div>
  );
}
