import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const ObrasPage = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchObras = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('obras')
      .select(`
        id, nome_obra, status_obra,
        clientes!cliente_id ( nome_completo, razao_social )
      `);

    if (error) {
      setError(error.message);
      console.error('Error fetching obras:', error);
    } else {
      setObras(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchObras();
  }, []);

  const handleAddObra = () => {
    navigate('/cadastros/obras/novo');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      const { error: deleteError } = await supabase
        .from('obras')
        .delete()
        .match({ id });

      if (deleteError) {
        setError(deleteError.message);
        console.error('Error deleting obra:', deleteError);
      } else {
        console.log('Obra excluída com sucesso!');
        fetchObras(); // Refresh the list
      }
    }
  };

  if (loading) {
    return <p className="p-6">Carregando obras...</p>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar obras: {error}</div>;
  }

  return (
    <div className="obras-container p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Obras</h1>
        <Button variant="primary" onClick={handleAddObra}>
          Adicionar Nova Obra
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse mt-6">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Nome da Obra</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Cliente</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(obra => (
              <tr key={obra.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{obra.nome_obra}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">
                  {obra.clientes ? (obra.clientes.razao_social || obra.clientes.nome_completo) : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">{obra.status_obra}</td>
                <td className="py-3 px-4 text-sm font-normal text-gray-800">
                  <Link to={`/cadastros/obras/visualizar/${obra.id}`} className="inline-block px-2 py-1 mx-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-secondary hover:bg-secondary/10">Visualizar</Link>
                  <Link to={`/cadastros/obras/editar/${obra.id}`} className="inline-block px-2 py-1 mx-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-accent hover:bg-accent/10">Editar</Link>
                  <Button onClick={() => handleDelete(obra.id)} variant="danger">Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObrasPage;
