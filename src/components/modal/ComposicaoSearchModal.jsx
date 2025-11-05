import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ComposicaoSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [composicoes, setComposicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchComposicoes();
    }
  }, [isOpen, searchTerm]);

  const fetchComposicoes = async () => {
    setLoading(true);
    let query = supabase.from('composicoes').select('id, codigo, descricao, unidade, custo_total');
    if (searchTerm) {
      query = query.ilike('descricao', `%${searchTerm}%`);
    }
    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Erro ao buscar composições:', error);
    } else {
      setComposicoes(data);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
        <h2 className="text-xl font-bold mb-4">Selecionar Composição</h2>
        <input
          type="text"
          placeholder="Pesquisar por descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <ul className="h-64 overflow-y-auto">
            {composicoes.map((composicao) => (
              <li
                key={composicao.id}
                onClick={() => {
                  onSelect(composicao);
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <strong>{composicao.codigo}</strong> - {composicao.descricao}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ComposicaoSearchModal;
