import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
const RecursosList = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecursos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        const formattedData = data.map(r => ({
          id: r.id,
          nome_descricao: r.nome_razao_social || r.descricao_equipamento || r.descricao_servico || 'N/A',
          tipo: r.tipo_recurso,
          contato: r.telefone || r.email || 'N/A',
          valor: r.valor ? `R$ ${r.valor} / ${r.unidade_pagamento || 'N/A'}` : (r.salario_base ? `R$ ${r.salario_base} / Mês` : 'N/A'),
        }));
        setRecursos(formattedData);
      }
      setLoading(false);
    };

    fetchRecursos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      const { error } = await supabase.from('recursos').delete().eq('id', id);

      if (error) {
        setError(`Erro ao excluir recurso: ${error.message}`);
      } else {
        setRecursos(recursos.filter(r => r.id !== id));
      }
    }
  };

  if (loading) {
    return <p>Carregando recursos...</p>;
  }

  if (error) {
    return <p>Erro ao carregar recursos: {error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Nome / Descrição</th>
            <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Tipo</th>
            <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Contato Principal</th>
            <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Valor</th>
            <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recursos.map(recurso => (
            <tr key={recurso.id}>
              <td className="py-3 px-4 whitespace-nowrap text-sm font-normal text-gray-800">{recurso.nome_descricao}</td>
              <td className="py-3 px-4 whitespace-nowrap text-sm font-normal text-gray-800">{recurso.tipo}</td>
              <td className="py-3 px-4 whitespace-nowrap text-sm font-normal text-gray-800">{recurso.contato}</td>
              <td className="py-3 px-4 whitespace-nowrap text-sm font-normal text-gray-800">{recurso.valor}</td>
              <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-normal text-gray-800">
                <Button onClick={() => console.log('Editar ' + recurso.id)} variant="ghost">Editar</Button>
                <Button onClick={() => handleDelete(recurso.id)} variant="danger">Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
export default RecursosList;
