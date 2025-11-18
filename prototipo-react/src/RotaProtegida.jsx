import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('apiToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Aqui está a validação que o erro pedia
RotaProtegida.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RotaProtegida;