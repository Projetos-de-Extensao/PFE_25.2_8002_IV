import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PainelDoAluno from './pages/PainelDoAluno';
import './App.css';

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('apiToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/painel-aluno" 
          element={
            <RotaProtegida>
              <PainelDoAluno />
            </RotaProtegida>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;