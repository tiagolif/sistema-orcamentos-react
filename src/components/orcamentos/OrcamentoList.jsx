import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import RelatoriosModal from '../relatorios/RelatoriosModal';

const OrcamentoList = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este orçamento?");
    if (confirmed) {
      const { error } = await supabase.from('orcamentos').delete().eq('id', id);
      if (error) {
        setError(error.message);
        console.error('Error deleting orcamento:', error);
      } else {
        setOrcamentos(orcamentos.filter(o => o.id !== id));
      }
    }
  };

  const handleOpenModal = (orcamento) => {
    setSelectedOrcamento(orcamento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrcamento(null);
  };

  useEffect(() => {
    const fetchOrcamentos = async () => {
      const { data, error } = await supabase
        .from('orcamentos_com_total')
        .select('id, descricao, valor_total, status, clientes(nome_completo, razao_social)');

      if (error) {
        setError(error.message);
        console.error('Error fetching orcamentos:', error);
      } else {
        setOrcamentos(data);
      }
    };

    fetchOrcamentos();
  }, []);

  if (error) {
    return <div className="text-red-500">Erro ao carregar orçamentos: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse mt-6">
        <thead>
        <tr className="bg-gray-50">
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Nº Orçamento</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Nome</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Cliente</th>
          <th className="py-3 px-4 text-right text-gray-500 font-medium uppercase text-xs tracking-wider">Valor Total</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">Status</th>
          <th className="py-3 px-4 text-center text-gray-500 font-medium uppercase text-xs tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody>
        {orcamentos.map(item => (
          <tr key={item.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{item.id}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{item.descricao}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{item.clientes ? (item.clientes.nome_completo || item.clientes.razao_social) : 'Cliente não encontrado'}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total)}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{item.status}</td>
            <td className="py-3 px-4 text-center text-sm font-normal text-gray-800">
              <div className="flex justify-center gap-2">
                <Link to={`/orcamento/${item.id}`} className="text-blue-500 hover:text-blue-700">
                  Visualizar
                </Link>
                <Link to={`/orcamentos/${item.id}/editar`} className="text-accent hover:text-orange-700">
                  Editar
                </Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                  Excluir
                </button>
                <button onClick={() => handleOpenModal(item)} className="text-green-500 hover:text-green-700">
                  Relatório
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {isModalOpen && selectedOrcamento && (
      <RelatoriosModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orcamentoId={selectedOrcamento.id}
      />
    )}
    </div>
  );
};

export default OrcamentoList;
