import { create } from 'zustand';
import { supabase } from '../supabaseClient';

let store;

const createOrcamentoStore = (set, get) => ({
  dadosGerais: { id: null, descricao: '', status: '' },
  itens: [],
  totais: { totalSemBDI: 0, totalBDI: 0, totalFinal: 0 },
  bdiRate: 25, // Definindo um valor padrão de 25%
  selectedId: null, // NOVO: Estado para guardar o ID da linha selecionada

  // NOVO: Ação para lidar com o clique na linha e definir o ID selecionado
  handleRowClick: (itemId) => {
    // Correção final: Remove a lógica de toggle para evitar deseleção acidental.
    // Um clique agora sempre define o item como selecionado.
    set({ selectedId: itemId });
  },

  // Busca os dados iniciais do orçamento e seus itens
  fetchOrcamento: async (id) => {
    const { data: orcamentoData, error: orcamentoError } = await supabase
      .from('orcamentos')
      .select('*, bdi_rate')
      .eq('id', id)
      .single();

    if (orcamentoError) {
      console.error('Erro ao buscar orçamento:', orcamentoError);
      return;
    }

    const { data: itensData, error: itensError } = await supabase
      .from('orcamento_itens_detalhados')
      .select('*')
      .eq('orcamento_id', id);

    if (itensError) {
      console.error('Erro ao buscar itens do orçamento:', itensError);
      return;
    }

    console.log('DEBUG: Dados brutos recebidos do Supabase (itensData):', itensData);

    const itensAchatados = itensData.map(item => ({
      id: item.id,
      parent_id: item.parent_id || null,
      tipo: item.tipo_item,
      codigo: item.codigo_insumo,
      base: 'SINAPI',
      descricao: item.descricao || 'Descrição não encontrada',
      unidade: item.unidade,
      quantidade: item.coeficiente,
      valor_unitario: item.preco_unitario,
      valor_mao_de_obra: item.custo_total_mao_obra || item.valor_mao_de_obra || 0, // Mapeamento corrigido
    }));

    set({
      dadosGerais: { id: orcamentoData.id, descricao: orcamentoData.descricao, status: orcamentoData.status },
      itens: itensAchatados,
      bdiRate: orcamentoData.bdi_rate || 0,
    });
    get().recalcularTotais();
  },



  // Adiciona uma nova etapa (otimista)
  adicionarEtapa: (descricao) => {
    const novaEtapa = {
      id: `temp-etapa-${Date.now()}`,
      tipo: 'ETAPA',
      descricao: descricao,
      parent_id: null,
      codigo: '--',
      unidade: '--',
      quantidade: null,
      valor_unitario: null,
    };
    set(state => ({ 
      itens: [...state.itens, novaEtapa],
      selectedId: novaEtapa.id // Define a nova etapa como selecionada automaticamente
    }));
  },

  // Exclui um item (real ou virtual)
  excluirItem: (itemId) => {
    set((state) => ({ itens: state.itens.filter((i) => i.id !== itemId) }));
    get().recalcularTotais();
  },

  // Salva TODAS as alterações de itens no banco de dados
  salvarOrcamentoEItens: async (orcamentoId) => {
    const { itens } = get();

    // 1. Filtra para pegar apenas itens que devem ir para o banco
    const itensParaSalvar = itens.filter(item => 
      item.tipo === 'ETAPA' || item.tipo === 'COMPOSICAO'
    ).map(item => ({
      id: typeof item.id === 'number' ? item.id : undefined, // Envia ID apenas se já existir
      orcamento_id: orcamentoId, // Usa o ID passado como parâmetro
      parent_id: item.parent_id,
      tipo_item: item.tipo,
      descricao_item: item.tipo === 'ETAPA' ? item.descricao : null,
      item_id: item.tipo === 'COMPOSICAO' ? item.item_id : null, 
      quantidade: item.quantidade,
      preco_unitario_congelado: item.valor_unitario,
    }));

    // 2. Usa upsert para criar ou atualizar todos os itens de uma vez
    const { error } = await supabase.from('orcamento_itens').upsert(itensParaSalvar, { onConflict: 'id' });

    if (error) {
      console.error('Falha ao salvar itens do orçamento:', error);
      alert('Erro ao salvar os itens. Verifique o console.');
      return;
    }

    // 3. Após salvar, recarrega os dados para ter uma visão limpa e consistente do DB
    await get().fetchOrcamento(orcamentoId); // Usa o ID passado como parâmetro
    alert('Orçamento salvo com sucesso!');
  },

  // Recalcula os totais gerais do orçamento
  recalcularTotais: () => {
    const { itens, bdiRate } = get();
    const totalSemBDI = itens
      .filter(item => item.tipo !== 'ETAPA')
      .reduce((acc, item) => acc + ((item.quantidade || 0) * (item.valor_unitario || 0)), 0);
    
    const totalMaoDeObra = itens
      .filter(item => item.tipo !== 'ETAPA')
      .reduce((acc, item) => acc + ((item.quantidade || 0) * (item.valor_mao_de_obra || 0)), 0);

    const totalBDI = totalSemBDI * (bdiRate / 100);
    const totalFinal = totalSemBDI + totalBDI;
    set({ totais: { totalSemBDI, totalBDI, totalFinal, totalMaoDeObra } });
  },

  // --- LÓGICA DE EDIÇÃO INLINE ---
  handleAdicionarComposicaoInline: (parentId) => {
    const newItem = {
      id: `temp-search-${Date.now()}`,
      tipo: 'SEARCHING',
      parent_id: parentId,
    };
    set((state) => ({ itens: [...state.itens, newItem] }));
  },

  atualizarItemBusca: (tempItemId, composicaoData, quantidade) => {
    set(state => {
      const tempItem = state.itens.find(i => i.id === tempItemId);
      const parentId = tempItem ? tempItem.parent_id : null;

      const novosItens = state.itens.map(item => {
        if (item.id === tempItemId) {
          return {
            parent_id: parentId,
            id: `temp-comp-${Date.now()}`,
            item_id: composicaoData.id, // ID da composição original
            tipo: 'COMPOSICAO',
            codigo: composicaoData.codigo,
            base: composicaoData.base, // <<< CORREÇÃO AQUI
            descricao: composicaoData.descricao,
            unidade: composicaoData.unidade,
            valor_unitario: composicaoData.custo_total,
            valor_mao_de_obra: composicaoData.valor_mao_de_obra, // <<< CORREÇÃO AQUI
            quantidade: quantidade, // Quantidade definida pelo usuário
          };
        }
        return item;
      });
      return { itens: novosItens };
    });
    get().recalcularTotais();
  },

  cancelarAdicao: (tempItemId) => {
    set((state) => ({ itens: state.itens.filter((i) => i.id !== tempItemId) }));
  },
});

// Padrão Singleton para a store, garantindo uma única instância
const useOrcamentoStore = (selector, equals) => {
  if (!store) {
    store = create(createOrcamentoStore);
  }
  return store(selector, equals);
};

const useOrcamentoStoreGet = () => {
  if (!store) {
    store = create(createOrcamentoStore);
  }
  return store.getState();
};

export { useOrcamentoStore, useOrcamentoStoreGet };
export default useOrcamentoStore;
