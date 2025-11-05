import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ComposicoesList from '../components/ComposicoesList';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ComposicoesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Composições</h1>
        <Link to="/composicoes/novo">
          <Button variant="primary">+ Nova Composição</Button>
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
      <ComposicoesList searchTerm={searchTerm} />
    </div>
  );
};

export default ComposicoesPage;
