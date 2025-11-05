import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useOrcamentoStore from '../store/orcamentoStore.jsx';
import PainelDeAcoes from '../components/orcamentos/PainelDeAcoes';
import TabelaOrcamento from '../components/orcamentos/TabelaOrcamento';
import ResumoCabecalho from '../components/orcamentos/ResumoCabecalho';


const PaginaOrcamento = () => {
  const { id } = useParams();
  const { dadosGerais, itens, totais, isLoading, error, fetchOrcamento, adicionarEtapa, excluirItem, selectedId, handleRowClick, handleAdicionarComposicaoInline, atualizarItemBusca, cancelarAdicao } = useOrcamentoStore();
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrcamento(id);
    }
  }, [fetchOrcamento, id]);

  const handleActionClick = (action) => {
    if (action === 'composicao') {
      let parentId = null; // Padrão é a raiz
      const selectedItem = itens.find(i => i.id === selectedId);

      if (selectedItem) {
        // Permite aninhar sob etapas ou outras composições
        if (selectedItem.tipo === 'ETAPA' || selectedItem.tipo === 'COMPOSICAO') {
          parentId = selectedItem.id;
        } else {
          // Se o item selecionado não for um container (ex: um insumo), usa o pai dele
          parentId = selectedItem.parent_id;
        }
      }
      
      // Adiciona a linha de busca. Se nenhum item estiver selecionado, será na raiz.
      handleAdicionarComposicaoInline(parentId);
      return;
    }

    // Para 'etapa' e outras ações, alterna o estado ativo ou desativa se a ação for nula.
    setActiveAction(prevAction => prevAction === action ? null : action);
  };



  // const handleSelectComposicao = (composicao) => { // Função do modal removida
  //   const parentId = selectedRowId;
  //   adicionarItem(composicao, parentId);
  //   setIsComposicaoModalOpen(false);
  // };

  if (isLoading) {
    return <div className="p-6">Carregando dados do orçamento...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar orçamento: {error.message}</div>;
  }

  return (
    <div className="p-4">
      {/* Cabeçalho */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2>{dadosGerais?.descricao || "Carregando..."}</h2>
        <p>Status: {dadosGerais?.status || "..."}</p>
      </div>

      {/* Barra de ferramentas */}
      <div className="flex justify-between items-start mb-4">
        <PainelDeAcoes activeAction={activeAction} onActionClick={handleActionClick} />
        <ResumoCabecalho />
      </div>
      <hr className="mb-4" />

      {/* Tabela */}
      <TabelaOrcamento
        itens={itens}
        totais={totais}
        bdiRate={dadosGerais.bdi_rate}
        activeAction={activeAction}
        onActionClick={handleActionClick}
        adicionarEtapa={adicionarEtapa}
        excluirItem={excluirItem}
        selectedId={selectedId}
        onRowClick={handleRowClick}
        atualizarItemBusca={atualizarItemBusca}
        cancelarAdicao={cancelarAdicao}

      />


    </div>
  );
};

export default PaginaOrcamento;