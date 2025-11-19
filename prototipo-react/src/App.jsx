import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PainelDoAluno from './pages/PainelDoAluno';
import PainelDoMonitor from './pages/PainelDoMonitor';
import TelaProfessores from './pages/TelaProfessores';
import TelaCoordenador from './pages/TelaCoordenador';
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
        
        <Route 
          path="/painel-monitor" 
          element={
            <RotaProtegida>
              <PainelDoMonitor />
            </RotaProtegida>
          } 
        />

        <Route 
          path="/painel-professor" 
          element={
            <RotaProtegida>
              <TelaProfessores />
            </RotaProtegida>
          } 
        />

        <Route 
          path="/painel-coordenador" 
          element={
            <RotaProtegida>
              <TelaCoordenador />
            </RotaProtegida>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;