import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const OrcamentoFiltros = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('descricao'); // 'descricao' ou 'codigo'
  const [ownerFilter, setOwnerFilter] = useState('');
  const [sortBy, setSortBy] = useState('mais_recentes');
  const [statusFilter, setStatusFilter] = useState([]);
  const [hasNoClient, setHasNoClient] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleStatusToggle = (statusName) => {
    setStatusFilter(prev =>
      prev.includes(statusName)
        ? prev.filter(s => s !== statusName)
        : [...prev, statusName]
    );
  };

  const handleFieldToggle = (field) => {
    setSearchField(field);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchText') setSearchText(value);
    else if (name === 'ownerFilter') setOwnerFilter(value);
    else if (name === 'sortBy') setSortBy(value);
    else if (name === 'categoryFilter') setCategoryFilter(value);
  };

  const handleSearch = () => {
    const filters = {
      searchText,
      searchField,
      ownerFilter,
      sortBy,
      statusFilter,
      hasNoClient,
      categoryFilter,
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
            placeholder="Pesquisar por descrição ou código..."
            value={searchText}
            onChange={handleInputChange}
            className="pl-10 pr-3 py-2 border rounded-md w-full"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Botões de Toggle para Campo de Busca */}
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <Button
            variant={searchField === 'descricao' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('descricao')}
            className="rounded-none"
          >
            Descrição
          </Button>
          <Button
            variant={searchField === 'codigo' ? 'primary' : 'secondary'}
            onClick={() => handleFieldToggle('codigo')}
            className="rounded-none"
          >
            Código
          </Button>
        </div>

        {/* Dropdowns */}
        <select
          name="ownerFilter"
          value={ownerFilter}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="">Dono</option>
          <option value="me">Meus Orçamentos</option>
          <option value="others">Outros</option>
        </select>

        <select
          name="sortBy"
          value={sortBy}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="mais_recentes">Mais Recentes</option>
          <option value="mais_antigos">Mais Antigos</option>
          <option value="maior_valor">Maior Valor</option>
          <option value="menor_valor">Menor Valor</option>
        </select>
      </div>

      {/* Linha Inferior: Filtros de Status e Outros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <Button
            variant={statusFilter.includes('nao_iniciado') ? 'primary' : 'secondary'}
            onClick={() => handleStatusToggle('nao_iniciado')}
            className="rounded-none"
          >
            Não Iniciado
          </Button>
          <Button
            variant={statusFilter.includes('em_andamento') ? 'primary' : 'secondary'}
            onClick={() => handleStatusToggle('em_andamento')}
            className="rounded-none"
          >
            Em Andamento
          </Button>
          <Button
            variant={statusFilter.includes('concluido') ? 'primary' : 'secondary'}
            onClick={() => handleStatusToggle('concluido')}
            className="rounded-none"
          >
            Concluído
          </Button>
          <Button
            variant={statusFilter.includes('atrasado') ? 'primary' : 'secondary'}
            onClick={() => handleStatusToggle('atrasado')}
            className="rounded-none"
          >
            Atrasado
          </Button>
        </div>

        {/* Dropdowns Adicionais */}
        <select
          name="categoryFilter"
          value={categoryFilter}
          onChange={handleInputChange}
          className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50 text-text-primary"
        >
          <option value="">Selecione a categoria</option>
          {/* Categorias dinâmicas aqui */}
        </select>

        <div className="flex-grow flex justify-end">
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoFiltros;
