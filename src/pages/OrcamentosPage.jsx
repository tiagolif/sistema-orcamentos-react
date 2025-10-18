import React from 'react';
import { Link } from 'react-router-dom';
import OrcamentoList from '../components/orcamentos/OrcamentoList';

const OrcamentosPage = () => {
  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestão de Orçamentos</h1>
        <Link to="/orcamentos/novo" className="btn btn-primary">
          + Novo Orçamento
        </Link>
      </div>
      <OrcamentoList />
    </div>
  );
};

export default OrcamentosPage;
