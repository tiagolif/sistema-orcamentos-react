import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const InsumosList = ({ searchTerm }) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('insumos')
          .select('id, codigo_item, descricao, unidade, preco_material, preco_mao_obra');

        if (searchTerm) {
          query = query.ilike('descricao', `%${searchTerm}%`);
        }

        const { data, error } = await query.limit(100);

        if (error) {
          throw error;
        }

        setInsumos(data);
      } catch (error) {
        setError(error.message);
        console.error('Erro ao buscar insumos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsumos();
  }, [searchTerm]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Código</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Descrição</th>
            <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Unidade</th>
            <th className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider">Preço Material</th>
            <th className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider">Preço Mão de Obra</th>
            <th className="py-3 px-4 text-center text-gray-500 font-medium uppercase text-xs tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4 text-sm text-gray-800">{insumo.codigo_item}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{insumo.descricao}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{insumo.unidade}</td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.preco_material || 0)}</td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.preco_mao_obra || 0)}</td>
              <td className="py-3 px-4 text-center">
                <Link to={`/insumos/${insumo.id}/editar`} className="text-blue-500 hover:text-blue-700">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsumosList;
