import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaListAlt } from 'react-icons/fa';
import useOrcamentoStore from '../store/orcamentoStore';
import PainelDeAcoes from '../components/orcamentos/PainelDeAcoes';
import ResumoCabecalho from '../components/orcamentos/ResumoCabecalho';
import TabelaOrcamento from '../components/orcamentos/TabelaOrcamento';

import ComposicaoSearchModal from '../components/modal/ComposicaoSearchModal';

const OrcamentoDetalhesPage = () => {
  const { id } = useParams();
  const { dadosGerais, itens, totais, bdiRate, fetchOrcamento, adicionarItem, excluirItem, adicionarEtapa } = useOrcamentoStore();
  const [activeAction, setActiveAction] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrcamento(id);
    }
  }, [id, fetchOrcamento]);

  const handleActionClick = (action) => {
    switch (action) {
      case 'composicao': {
        const parentItem = itens.find(it => it.id === selectedId);
        if (!selectedId || (parentItem && parentItem.tipo !== 'ETAPA' && parentItem.tipo !== 'COMPOSICAO')) {
          alert("Por favor, selecione uma Etapa ou uma Composição na tabela para adicionar um item.");
          return;
        }
        setActiveAction(action);
        setIsSearchModalOpen(true);
        break;
      }
      case 'etapa':
      case 'insumo':
        setActiveAction(action);
        break;
      default:
        setActiveAction(null);
        break;
    }
  };

  const handleRowClick = (itemId) => {
    setSelectedId(prevId => prevId === itemId ? null : itemId);
  };

  const handleCloseModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSelectComposicao = (composicao) => {
    const novoItem = {
      codigo: composicao.codigo,
      descricao: composicao.descricao,
      unidade: composicao.unidade,
      valor_unitario: composicao.custo_total,
      tipo: 'COMPOSICAO',
      quantidade: 1,
      parent_id: selectedId,
    };
    adicionarItem(novoItem);
    setIsSearchModalOpen(false);
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
        <TabelaOrcamento 
          itens={itens} 
          totais={totais} 
          bdiRate={bdiRate} 
          activeAction={activeAction} 
          onActionClick={handleActionClick}
          adicionarEtapa={adicionarEtapa}
          excluirItem={excluirItem}
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      </div>

      {isSearchModalOpen && (
        <ComposicaoSearchModal 
          isOpen={isSearchModalOpen} 
          onClose={handleCloseModal} 
          onSelect={handleSelectComposicao} 
        />
      )}
    </div>
  );
};

export default OrcamentoDetalhesPage;
