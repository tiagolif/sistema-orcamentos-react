import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../ui/Button';

const RecursosList = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecursos = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('recursos_humanos')
      .select('id, nome_completo, funcao, tipo_contrato, custo_hora, custo_diaria, cpf, telefone, email, data_admissao, status');

    if (error) {
      setError(error.message);
      console.error('Error fetching recursos:', error);
    } else {
      setRecursos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      const { error: deleteError } = await supabase
        .from('recursos_humanos')
        .delete()
        .match({ id });

      if (deleteError) {
        setError(deleteError.message);
        console.error('Error deleting recurso:', deleteError);
      } else {
        console.log('Recurso excluído com sucesso!');
        fetchRecursos(); // Refresh the list
      }
    }
  };

  if (loading) {
    return <p className="p-6">Carregando recursos...</p>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar recursos: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider w-[20%]">Nome Completo</th>
              <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider w-[15%]">Função</th>
              <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider w-[10%]">Tipo Contrato</th>
              <th scope="col" className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider w-[10%]">Custo/Hora</th>
              <th scope="col" className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider w-[10%]">Custo/Diária</th>
              <th scope="col" className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider w-[10%]">Status</th>
              <th scope="col" className="py-3 px-4 text-center text-gray-500 font-medium uppercase text-xs tracking-wider w-[15%]">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recursos.map(recurso => (
              <tr key={recurso.id}>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{recurso.nome_completo}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{recurso.funcao || 'N/A'}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{recurso.tipo_contrato}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800 text-right">{recurso.custo_hora ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurso.custo_hora) : 'N/A'}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800 text-right">{recurso.custo_diaria ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurso.custo_diaria) : 'N/A'}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{recurso.status}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Link to={`/cadastros/recursos/visualizar/${recurso.id}`} className="inline-block px-2 py-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-secondary hover:bg-secondary/10 text-xs">Visualizar</Link>
                    <span className="text-gray-400 text-xs">|</span>
                    <Link to={`/cadastros/recursos/editar/${recurso.id}`} className="inline-block px-2 py-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-accent hover:bg-accent/10 text-xs">Editar</Link>
                    <span className="text-gray-400 text-xs">|</span>
                    <Button onClick={() => handleDelete(recurso.id)} variant="danger" size="sm" className="text-xs px-2 py-1">Excluir</Button>
                  </div>
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
