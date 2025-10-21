import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import Button from '../ui/Button.jsx'; // Import Button component

const WorkList = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('obras')
          .select(`
            *,
            clientes (
              nome_completo,
              razao_social
            )
          `);

        if (error) {
          throw error;
        }
        
        // Mapeia os dados para extrair o nome do cliente
        const formattedData = data.map(work => ({
          ...work,
          client_name: work.clientes ? (work.clientes.nome_completo || work.clientes.razao_social) : 'Cliente não associado'
        }));

        setWorks(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const handleEdit = (id) => {
    // Futuramente, navegar para a página de edição da obra
    // console.log('Editar obra com ID:', id);
    // navigate(`/obras/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      const { error } = await supabase.from('obras').delete().match({ id });

      if (error) {
        setError(`Erro ao excluir a obra: ${error.message}`);
      } else {
        // Remove a obra da lista no estado local para atualizar a UI
        setWorks(works.filter(work => work.id !== id));
      }
    }
  };

  if (loading) {
    return <p>Carregando obras...</p>;
  }

  if (error) {
    return <p>Erro ao carregar obras: {error}</p>;
  }

  return (
    <table className="w-full border-collapse mt-6 bg-white rounded-lg overflow-hidden shadow-md"> {/* work-table */}
      <thead>
        <tr>
          <th className="p-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Nome da Obra</th> {/* work-table thead th */}
          <th className="p-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Cliente Associado</th>
          <th className="p-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Status</th>
          <th className="p-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody>
        {works.map(work => (
          <tr key={work.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100"> {/* work-table tbody tr */}
            <td className="p-4 text-base">{work.name}</td> {/* work-table td */}
            <td className="p-4 text-base">{work.client_name}</td>
            <td className="p-4 text-base">{work.status}</td>
            <td className="p-4 text-base">
              <Button onClick={() => handleEdit(work.id)} variant="ghost">Editar</Button>
              <Button onClick={() => handleDelete(work.id)} variant="danger">Excluir</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkList;
