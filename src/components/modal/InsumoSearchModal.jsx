import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const InsumoSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchInsumos();
    }
  }, [isOpen, searchTerm]);

  const fetchInsumos = async () => {
    setLoading(true);
    let query = supabase.from('insumos').select('id, codigo_item, descricao, unidade, custo_unitario, tipo_insumo');
    if (searchTerm) {
      query = query.ilike('descricao', `%${searchTerm}%`);
    }
    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Erro ao buscar insumos:', error);
    } else {
      setInsumos(data);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
        <h2 className="text-xl font-bold mb-4">Selecionar Insumo</h2>
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
            {insumos.map((insumo) => (
              <li
                key={insumo.id}
                onClick={() => {
                  onSelect(insumo);
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <strong>{insumo.codigo_item}</strong> - {insumo.descricao}
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

export default InsumoSearchModal;
