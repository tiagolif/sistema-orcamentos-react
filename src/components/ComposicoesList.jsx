import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ComposicoesList = ({ searchTerm }) => {
  const [composicoes, setComposicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComposicoes = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('composicoes')
          .select('id, codigo, descricao, unidade, custo_total');

        if (searchTerm) {
          query = query.ilike('descricao', `%${searchTerm}%`);
        }

        const { data, error } = await query.limit(100);

        if (error) {
          throw error;
        }

        setComposicoes(data);
      } catch (error) {
        setError(error.message);
        console.error('Erro ao buscar composições:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComposicoes();
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
            <th className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider">Custo Total</th>
            <th className="py-3 px-4 text-center text-gray-500 font-medium uppercase text-xs tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {composicoes.map((composicao) => (
            <tr key={composicao.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4 text-sm text-gray-800">{composicao.codigo}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{composicao.descricao}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{composicao.unidade}</td>
              <td className="py-3 px-4 text-sm text-gray-800 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(composicao.custo_total)}</td>
              <td className="py-3 px-4 text-center">
                <Link to={`/composicoes/${composicao.id}/editar`} className="text-blue-500 hover:text-blue-700">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComposicoesList;
