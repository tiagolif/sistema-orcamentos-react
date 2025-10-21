import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaListAlt } from 'react-icons/fa';
import useOrcamentoStore from '../store/orcamentoStore';
import PainelDeAcoes from '../components/orcamentos/PainelDeAcoes';
import ResumoCabecalho from '../components/orcamentos/ResumoCabecalho';
import TabelaOrcamento from '../components/orcamentos/TabelaOrcamento';

const OrcamentoDetalhesPage = () => {
  const { id } = useParams();
  const { dadosGerais, itens, totais, bdiRate, fetchOrcamento } = useOrcamentoStore();
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrcamento(id);
    }
  }, [id, fetchOrcamento]);

  const handleActionClick = (action) => {
    setActiveAction(prevAction => prevAction === action ? null : action);
  };

  if (!dadosGerais.id) {
    return <div className="p-6">Carregando orçamento...</div>;
  }

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      {/* Cabeçalho Fixo */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full border">
            <FaListAlt className="text-xl text-text-primary" />
          </div>
          {/* Title and Subtitle */}
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-text-primary">Orçamento</h1>
            <p className="text-sm text-text-secondary">{dadosGerais.descricao || 'Carregando...'}</p>
          </div>
          {/* Status Badge */}
          <div className="ml-auto">
            <span className="px-3 py-1 text-xs font-semibold text-text-primary bg-gray-200 rounded-full">
              {dadosGerais.status || 'Não iniciado'}
            </span>
          </div>
        </div>
      </header>

      {/* Barra de Ferramentas e Resumo Cabeçalho */}
      <div className="flex flex-row items-stretch gap-6 px-6 py-4 border-b border-gray-200">
        {/* Coluna da Esquerda: Painel de Ações */}
        <div className="flex-grow">
          <PainelDeAcoes activeAction={activeAction} onActionClick={handleActionClick} />
        </div>
        {/* Coluna da Direita: Resumo do Cabeçalho */}
        <div className="flex-shrink-0">
          <ResumoCabecalho />
        </div>
      </div>

      {/* Tabela de Orçamento */}
      <div className="w-full px-2 flex-grow">
        <TabelaOrcamento itens={itens} totais={totais} bdiRate={bdiRate} />
      </div>
    </div>
  );
};

export default OrcamentoDetalhesPage;
