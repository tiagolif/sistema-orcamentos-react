import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import OrcamentoList from '../components/orcamentos/OrcamentoList.jsx';
import OrcamentoFiltros from '../components/orcamentos/OrcamentoFiltros.jsx';

const OrcamentosPage = () => {
  return (
    <div className="page-container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Orçamentos</h1>
        <Link to="/orcamentos/novo">
          <Button variant="primary">
            + Novo Orçamento
          </Button>
        </Link>
      </div>
      <OrcamentoFiltros />
      <OrcamentoList />
    </div>
  );
};

export default OrcamentosPage;
