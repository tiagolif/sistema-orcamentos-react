import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InsumosList from '../components/InsumosList.jsx';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const InsumosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Insumos</h1>
        <Link to="/insumos/novo">
          <Button variant="primary">+ Adicionar Novo Insumo</Button>
        </Link>
      </div>
      <div className="mb-4">
        <Input 
          type="text"
          placeholder="Pesquisar por descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>
      <InsumosList searchTerm={searchTerm} />
    </div>
  );
};

export default InsumosPage;
