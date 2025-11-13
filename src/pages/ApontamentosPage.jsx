import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const ApontamentosPage = () => {
  const [apontamentos, setApontamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchApontamentos = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('apontamentos_mo')
      .select(`
        id, data_apontamento, horas_trabalhadas, diaria_trabalhada, descricao_servico,
        recursos_humanos!recurso_id ( nome_completo, funcao ),
        obras!obra_id ( nome_obra )
      `);

    if (error) {
      setError(error.message);
      console.error('Error fetching apontamentos:', error);
    } else {
      setApontamentos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApontamentos();
  }, []);

  const handleAddApontamento = () => {
    navigate('/apontamentos/novo');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este apontamento?')) {
      const { error: deleteError } = await supabase
        .from('apontamentos_mo')
        .delete()
        .match({ id });

      if (deleteError) {
        setError(deleteError.message);
        console.error('Error deleting apontamento:', deleteError);
      } else {
        console.log('Apontamento excluído com sucesso!');
        fetchApontamentos(); // Refresh the list
      }
    }
  };

  if (loading) {
    return <p className="p-6">Carregando apontamentos...</p>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar apontamentos: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Apontamentos</h1>
        <div className="flex gap-4">
          <Link to="/apontamentos/relatorio">
            <Button variant="secondary">
              Gerar Relatório de Pagamento
            </Button>
          </Link>
          <Button variant="primary" onClick={handleAddApontamento}>
            Novo Apontamento
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left w-[20%]">Recurso</th>
              <th className="py-2 px-4 text-left w-[15%]">Obra</th>
              <th className="py-2 px-4 text-right w-[10%]">Data</th>
              <th className="py-2 px-4 text-right w-[10%]">Horas</th>
              <th className="py-2 px-4 text-right w-[10%]">Diária</th>
              <th className="py-2 px-4 text-left w-[15%]">Serviço</th>
              <th className="py-2 px-4 text-center w-[15%]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {apontamentos.map((apontamento) => (
              <tr key={apontamento.id}>
                <td className="py-2 px-4 text-sm">{apontamento.recursos_humanos ? `${apontamento.recursos_humanos.nome_completo} (${apontamento.recursos_humanos.funcao})` : 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{apontamento.obras ? apontamento.obras.nome_obra : 'N/A'}</td>
                <td className="py-2 px-4 text-sm text-right">{new Date(apontamento.data_apontamento).toLocaleDateString('pt-BR')}</td>
                <td className="py-2 px-4 text-sm text-right">{apontamento.horas_trabalhadas || '0.00'}</td>
                <td className="py-2 px-4 text-sm text-right">{apontamento.diaria_trabalhada || '0.00'}</td>
                <td className="py-2 px-4 text-sm">{apontamento.descricao_servico || 'N/A'}</td>
                <td className="py-2 px-4 text-sm text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Link to={`/apontamentos/visualizar/${apontamento.id}`} className="inline-block px-2 py-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-secondary hover:bg-secondary/10 text-xs">Visualizar</Link>
                    <span className="text-gray-400 text-xs">|</span>
                    <Link to={`/apontamentos/editar/${apontamento.id}`} className="inline-block px-2 py-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-accent hover:bg-accent/10 text-xs">Editar</Link>
                    <span className="text-gray-400 text-xs">|</span>
                    <Button onClick={() => handleDelete(apontamento.id)} variant="danger" size="sm" className="text-xs px-2 py-1">Excluir</Button>
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

export default ApontamentosPage;
