import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SupplierFiltros = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('nome'); // 'nome', 'cpf_cnpj', 'email'
  const [personType, setPersonType] = useState(''); // 'pf', 'pj'
  const [sortBy, setSortBy] = useState('nome'); // 'nome', 'created_at'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchText') setSearchText(value);
    else if (name === 'personType') setPersonType(value);
    else if (name === 'sortBy') setSortBy(value);
  };

  const handleFieldToggle = (field) => {
    setSearchField(field);
  };

  const handleSearch = () => {
    const filters = {
      searchText,
      searchField,
      personType,
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
            placeholder="Pesquisar por nome, CPF/CNPJ ou e-mail..."
            value={searchText}
            onChange={handleInputChange}
            className="pl-10 pr-3 py-2 border rounded-md w-full"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Botões de Toggle para Campo de Busca */}
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <Button
            variant={searchField === 'nome' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('nome')}
            className="rounded-none"
          >
            Nome/Razão Social
          </Button>
          <Button
            variant={searchField === 'cpf_cnpj' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('cpf_cnpj')}
            className="rounded-none"
          >
            CPF/CNPJ
          </Button>
          <Button
            variant={searchField === 'email' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('email')}
            className="rounded-none"
          >
            E-mail
          </Button>
        </div>

        {/* Dropdowns */}
        <select
          name="personType"
          value={personType}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="">Tipo de Pessoa</option>
          <option value="pf">Pessoa Física</option>
          <option value="pj">Pessoa Jurídica</option>
        </select>

        <select
          name="sortBy"
          value={sortBy}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="nome">Nome (A-Z)</option>
          <option value="created_at">Mais Recentes</option>
        </select>

        <div className="flex-grow flex justify-end">
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierFiltros;
