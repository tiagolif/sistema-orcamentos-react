import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useOrcamentoStore from '../store/orcamentoStore';
import PainelDeAcoes from '../components/orcamentos/PainelDeAcoes';
import TabelaOrcamento from '../components/orcamentos/TabelaOrcamento';
import ResumoFinanceiro from '../components/orcamentos/ResumoFinanceiro';
import ResumoCabecalho from '../components/orcamentos/ResumoCabecalho';

const PaginaOrcamento = () => {
  const { id } = useParams();
  const { dadosGerais, itens, totais, isLoading, error, fetchOrcamento } = useOrcamentoStore();
  const [activeAction, setActiveAction] = useState(null); // State to manage active action

  useEffect(() => {
    if (id) {
      fetchOrcamento(id);
    }
  }, [fetchOrcamento, id]);

  const handleActionClick = (action) => {
    setActiveAction(prevAction => prevAction === action ? null : action);
  };

  if (isLoading) {
    return <div className="p-6">Carregando dados do orçamento...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar orçamento: {error.message}</div>;
  }

  return (
    <div className="p-4">
      {/* Cabeçalho que mostra dados gerais ou carregando */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2>{dadosGerais?.descricao || "Carregando..."}</h2>
        <p>Status: {dadosGerais?.status || "..."}</p>
      </div>

      {/* Barra de ferramentas superior */}
      <div className="flex justify-between items-start mb-4">
        <PainelDeAcoes activeAction={activeAction} onActionClick={handleActionClick} />
        <ResumoCabecalho />
      </div>
      <hr className="mb-4" />

      {/* Tabela de largura total */}
      <TabelaOrcamento itens={itens} totais={totais} activeAction={activeAction} />

    </div>
  );
};

export default PaginaOrcamento;