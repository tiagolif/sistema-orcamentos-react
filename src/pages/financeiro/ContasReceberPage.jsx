import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import FormContasReceber from './FormContasReceber.jsx';
import { supabase } from '../../supabaseClient';

const ContasReceberPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLancamentos = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('lancamentos_financeiros')
      .select(`
        *,
        clientes(nome_completo, razao_social),
        obras(nome_obra)
      `)
      .eq('tipo', 'RECEITA');
    if (error) {
      setError(error.message);
      console.error('Error fetching lancamentos:', error);
    } else {
      setLancamentos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLancamentos();
  }, []);

  const handleSaveSuccess = () => {
    fetchLancamentos();
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      const { error: deleteError } = await supabase
        .from('lancamentos_financeiros')
        .delete()
        .match({ id });

      if (deleteError) {
        console.error('Error deleting lancamento:', deleteError);
      } else {
        console.log('Lançamento excluído com sucesso!');
        fetchLancamentos(); // Refresh the list
      }
    }
  };

  if (loading) {
    return <p className="p-6">Carregando lançamentos...</p>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar lançamentos: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contas a Receber</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          Novo Lançamento
        </Button>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Lançamentos</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left w-[30%]">Descrição</th>
              <th className="py-2 px-4 text-right w-[10%]">Valor</th>
              <th className="py-2 px-4 text-right w-[10%]">Vencimento</th>
              <th className="py-2 px-4 text-left w-[8%]">Status</th>
              <th className="py-2 px-4 text-left w-[15%]">Cliente</th>
              <th className="py-2 px-4 text-left w-[15%]">Obra</th>
              <th className="py-2 px-4 text-center w-[12%]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((lancamento) => (
              <tr key={lancamento.id}>
                <td className="py-2 px-4 text-sm">{lancamento.descricao}</td>
                <td className="py-2 px-4 text-sm text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lancamento.valor)}</td>
                <td className="py-2 px-4 text-sm text-right">{new Date(lancamento.data_vencimento).toLocaleDateString('pt-BR')}</td>
                <td className="py-2 px-4 text-sm">{lancamento.status}</td>
                <td className="py-2 px-4 text-sm">{lancamento.clientes ? (lancamento.clientes.razao_social || lancamento.clientes.nome_completo) : 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{lancamento.obras ? lancamento.obras.nome_obra : 'N/A'}</td>
                <td className="py-2 px-4 text-sm text-center">
                  <Link to={`/financeiro/contas-a-receber/visualizar/${lancamento.id}`} className="inline-block px-2 py-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-secondary hover:bg-secondary/10 text-xs">Visualizar</Link>
                  <span className="text-gray-400 text-xs">|</span>
                  <Button variant="ghost" size="sm" className="text-xs px-2 py-1">Editar</Button>
                  <span className="text-gray-400 text-xs">|</span>
                  <Button onClick={() => handleDelete(lancamento.id)} variant="danger" size="sm" className="text-xs px-2 py-1">Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Novo Lançamento */}
      <FormContasReceber
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default ContasReceberPage;