import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RecursoFiltros = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('nome_descricao'); // 'nome_descricao', 'contato'
  const [resourceType, setResourceType] = useState(''); // 'CLT', 'AUTONOMO', 'EQUIPAMENTO', 'SERVICO'
  const [sortBy, setSortBy] = useState('nome_descricao'); // 'nome_descricao', 'created_at'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchText') setSearchText(value);
    else if (name === 'resourceType') setResourceType(value);
    else if (name === 'sortBy') setSortBy(value);
  };

  const handleFieldToggle = (field) => {
    setSearchField(field);
  };

  const handleSearch = () => {
    const filters = {
      searchText,
      searchField,
      resourceType,
      sortBy,
    };
    onSearch(filters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* Linha Superior: Pesquisa e Filtros Principais */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Campo de Pesquisa */}
        <div className="relative flex-grow">
          <Input
            type="text"
            name="searchText"
            placeholder="Pesquisar por nome, descrição ou contato..."
            value={searchText}
            onChange={handleInputChange}
            className="pl-10 pr-3 py-2 border rounded-md w-full"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Botões de Toggle para Campo de Busca */}
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <Button
            variant={searchField === 'nome_descricao' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('nome_descricao')}
            className="rounded-none"
          >
            Nome/Descrição
          </Button>
          <Button
            variant={searchField === 'contato' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('contato')}
            className="rounded-none"
          >
            Contato Principal
          </Button>
        </div>

        {/* Dropdowns */}
        <select
          name="resourceType"
          value={resourceType}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="">Tipo de Recurso</option>
          <option value="CLT">Funcionário (CLT)</option>
          <option value="AUTONOMO">Autônomo</option>
          <option value="EQUIPAMENTO">Equipamento</option>
          <option value="SERVICO">Serviço (Terceirizado)</option>
        </select>

        <select
          name="sortBy"
          value={sortBy}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="nome_descricao">Nome/Descrição (A-Z)</option>
          <option value="created_at">Mais Recentes</option>
        </select>

        <div className="flex-grow flex justify-end">
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
        </div>
      </div>
    </div>
  );
};

export default RecursoFiltros;
