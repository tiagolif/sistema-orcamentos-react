import React from 'react';
import { Link } from 'react-router-dom';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierFiltros from '../components/suppliers/SupplierFiltros.jsx';
import Button from '../components/ui/Button.jsx';

const Fornecedores = () => {
  return (
    <div className="fornecedores-container p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Fornecedores</h1>
        <Link to="/fornecedores/novo">
          <Button variant="primary">
            Adicionar Novo Fornecedor
          </Button>
        </Link>
      </div>
      <SupplierFiltros />
      <SupplierList />
    </div>
  );
};

export default Fornecedores;
