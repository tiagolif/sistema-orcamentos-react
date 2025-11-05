import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { XMarkIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useDebounce } from '../../hooks/useDebounce';

const ItemSearchRow = ({ item, onCancel, onSave }) => {
  const [codigoTerm, setCodigoTerm] = useState('');
  const [descricaoTerm, setDescricaoTerm] = useState('');
  const [selectedBase, setSelectedBase] = useState('SINAPI');
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState('');
  const [valorUnitario, setValorUnitario] = useState(0);
  const [valorMaoDeObra, setValorMaoDeObra] = useState(0);
  
  const [selectedComposicao, setSelectedComposicao] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const codigoInputRef = useRef(null);
  const descricaoInputRef = useRef(null);
  const quantidadeInputRef = useRef(null);

  const debouncedDescricaoTerm = useDebounce(descricaoTerm, 500);

  useEffect(() => {
    codigoInputRef.current?.focus();
  }, []);

  // useEffect para busca APENAS por descrição
  useEffect(() => {
    const fetchComposicoesPorDescricao = async () => {
      if (!debouncedDescricaoTerm) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('composicoes')
        .select('id, codigo, descricao, unidade, custo_total, custo_total_mao_obra')
        .ilike('descricao', `%${debouncedDescricaoTerm}%`)
        .limit(10);

      if (error) {
        console.error('Erro ao buscar composições por descrição:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data);
        setShowResults(true);
      }
      setLoading(false);
    };

    fetchComposicoesPorDescricao();
  }, [debouncedDescricaoTerm]);

  const handleSelectResult = (result) => {
    // Normaliza o campo de mão de obra para o nome que a store espera
    const normalized = { ...result, valor_mao_de_obra: result.custo_total_mao_obra ?? result.valor_mao_de_obra ?? 0 };
    setSelectedComposicao(normalized);
    setCodigoTerm(normalized.codigo);
    setDescricaoTerm(normalized.descricao);
    setUnidade(normalized.unidade);
    setValorUnitario(normalized.custo_total || 0);
    setValorMaoDeObra(normalized.valor_mao_de_obra || 0);
    setShowResults(false);
    quantidadeInputRef.current?.focus();
  };

  // Função para buscar pelo código exato ao sair do campo
  const handleCodigoBlur = async () => {
    if (!codigoTerm) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('composicoes')
      .select('id, codigo, descricao, unidade, custo_total, custo_total_mao_obra')
      .eq('codigo', codigoTerm)
      .limit(1);

    if (error) {
      console.error('Erro ao buscar composição por código:', error);
    } else if (data && data.length > 0) {
      handleSelectResult(data[0]);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (selectedComposicao && quantidade > 0) {
      // Garantir que o objeto enviado tenha o campo valor_mao_de_obra que a store espera
      const payload = {
        ...selectedComposicao,
        valor_mao_de_obra: selectedComposicao.valor_mao_de_obra ?? selectedComposicao.custo_total_mao_obra ?? valorMaoDeObra ?? 0,
      };
      onSave(payload, quantidade);
    }
  };

  const renderAutocompleteResults = () => {
    if (showResults && searchResults.length > 0) {
      return (
        <ul className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg w-full autocomplete-results">
          {searchResults.map(result => (
            <li
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className="p-2 cursor-pointer hover:bg-gray-100 text-xs"
            >
              {result.codigo} - {result.descricao}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <td className="px-2 py-1 w-8 bg-gray-100 border-b border-gray-200"></td>
      <td className="px-2 py-1 w-16 text-left bg-gray-100 border-b border-gray-200"></td>
      <td className="px-2 py-1 w-16 text-left relative bg-gray-100 border-b border-gray-200">
        <input
          type="text"
          ref={codigoInputRef}
          value={codigoTerm}
          onChange={(e) => setCodigoTerm(e.target.value)}
          onBlur={handleCodigoBlur} // <-- MUDANÇA AQUI
          placeholder="Cód."
          className="w-full py-1 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {/* Removida a lista de resultados daqui */}
      </td>
      <td className="px-2 py-1 w-24 text-left bg-gray-100 border-b border-gray-200">
        <select
          value={selectedBase}
          onChange={(e) => setSelectedBase(e.target.value)}
          className="w-full py-1 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="SINAPI">SINAPI</option>
        </select>
      </td>
      <td className="px-2 py-1 w-1/3 text-left relative bg-gray-100 border-b border-gray-200">
        <input
          type="text"
          ref={descricaoInputRef}
          value={descricaoTerm}
          onChange={(e) => setDescricaoTerm(e.target.value)}
          placeholder="Descrição"
          className="w-full py-1 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {renderAutocompleteResults()} {/* Mantida a lista de resultados aqui */}
      </td>
      <td className="px-2 py-1 w-12 text-center bg-gray-100 border-b border-gray-200">{unidade}</td>
      <td className="px-2 py-1 w-16 text-right bg-gray-100 border-b border-gray-200">
        <input
          type="number"
          ref={quantidadeInputRef}
          value={quantidade}
          onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
          className="w-full py-1 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
        />
      </td>
      <td className="px-2 py-1 w-24 text-right bg-gray-100 border-b border-gray-200">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorUnitario)}</td>
      <td className="px-2 py-1 w-24 text-right bg-gray-100 border-b border-gray-200"></td>
      <td className="px-2 py-1 w-24 text-right bg-gray-100 border-b border-gray-200"></td>
      <td className="px-2 py-1 w-8 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button onClick={handleSave} disabled={!selectedComposicao || quantidade <= 0} className="text-green-500 hover:text-green-700 disabled:text-gray-300">
            <CheckIcon className="h-5 w-5" />
          </button>
          <button onClick={onCancel} className="text-red-500 hover:text-red-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </React.Fragment>
  );
};

export default ItemSearchRow;
