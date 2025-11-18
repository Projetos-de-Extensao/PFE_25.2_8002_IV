import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PainelDoAluno from './pages/PainelDoAluno';
import RotaProtegida from './RotaProtegida';
import './App.css';

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