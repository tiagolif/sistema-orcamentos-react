import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useOrcamentoStore = create((set, get) => ({
  dadosGerais: { id: null, descricao: '', status: '' },
  itens: [],
  totais: { totalSemBDI: 0, totalBDI: 0, totalFinal: 0 },
  bdiRate: 0, // Adicionado: Taxa de BDI

  fetchOrcamento: async (id) => {
    const { data, error } = await supabase
      .from('orcamentos')
      .select(`
        *,
        bdi_rate, // Adicionado: Selecionar a taxa de BDI
        orcamento_itens (
          *,
          itens_da_base (
            *
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar orçamento:', error);
      return;
    }

    // Achatando os dados para o formato que a UI espera
    const itensAchatados = data.orcamento_itens.map(item => ({
      id: item.id,
      parent_id: item.parent_id || null,
      tipo: item.itens_da_base.tipo,
      item: item.item, // O número do item, pode precisar de ajuste
      codigo: item.itens_da_base.codigo,
      base: item.itens_da_base.base,
      descricao: item.itens_da_base.descricao,
      unidade: item.itens_da_base.unidade,
      quantidade: item.quantidade,
      valor_unitario: item.preco_unitario_congelado || item.itens_da_base.valor_unitario,
    }));

    set({ 
      dadosGerais: { id: data.id, descricao: data.descricao, status: data.status }, 
      itens: itensAchatados,
      bdiRate: data.bdi_rate || 0, // Adicionado: Armazenar a taxa de BDI
    });
    get().recalcularTotais();
  },

  adicionarItem: (item) => {
    set((state) => ({ itens: [...state.itens, item] }));
    get().recalcularTotais();
  },

  removerItem: (itemId) => {
    set((state) => ({ itens: state.itens.filter((i) => i.id !== itemId) }));
    get().recalcularTotais();
  },

  atualizarItem: (itemId, updates) => {
    set((state) => ({
      itens: state.itens.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
    }));
    get().recalcularTotais();
  },

  recalcularTotais: () => {
    const itens = get().itens;
    const bdiRate = get().bdiRate; // Obter a taxa de BDI do estado
    const totalSemBDI = itens.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0);
    const totalBDI = totalSemBDI * (bdiRate / 100); // Calcular o BDI
    const totalFinal = totalSemBDI + totalBDI; // Calcular o total final

    set({ totais: { totalSemBDI, totalBDI, totalFinal } });
  },
}));

export default useOrcamentoStore;
