import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useRelatoriosStore = create((set, get) => ({
  relatorioAtual: null,
  configuracoes: {},
  
  // Define o relatório atual
  setRelatorioAtual: (relatorio) => set({ relatorioAtual: relatorio }),
  
  // Gera o relatório sintético
  gerarRelatorioSintetico: async (orcamentoId) => {
    const { data: itens, error } = await supabase
      .from('orcamento_itens')
      .select(`
        id,
        orcamento_id,
        quantidade,
        preco_unitario_congelado,
        insumos:item_id (
          id,
          codigo_item,
          descricao,
          unidade,
          preco_material,
          preco_mao_obra
        )
      `)
      .eq('orcamento_id', orcamentoId)
      .order('id');

    if (error) {
      console.error('Erro ao buscar itens (sintético):', error);
      throw new Error('Não foi possível gerar o relatório sintético. Verifique se há itens no orçamento.');
    }

    if (!itens || itens.length === 0) {
      throw new Error('Nenhum item encontrado no orçamento para gerar o relatório.');
    }

    return {
                tipo: 'SINTETICO',
                itens: itens.map((item, index) => {
                  const fonte = item.insumos;        if (!fonte) {
          console.warn(`Item ${item.id} não possui referência na base de dados`);
        }

const valorUnitario = item.preco_unitario_congelado ?? ((fonte?.preco_material || 0) + (fonte?.preco_mao_obra || 0));
        // Por enquanto, consideramos que não temos mão de obra separada na base atual
        const valorMaoObra = 0;
        const bdi = 0; // BDI será implementado depois que tivermos a coluna

        const valorComBDI = parseFloat(valorUnitario) * (1 + (parseFloat(bdi) || 0) / 100);
        const total = (parseFloat(item.quantidade) || 0) * valorComBDI;

        return {
          item: index + 1, // Número sequencial do item no orçamento
          codigo: fonte?.codigo_item || '---',
          descricao: fonte?.descricao || 'Item não encontrado na base',
          unidade: fonte?.unidade || '---',
          quantidade: parseFloat(item.quantidade) || 0,
          valorUnitario,
          valorMaoObra,
          valorComBDI,
          total
        };
      })
    };
  },

  // Gera o relatório analítico
  gerarRelatorioAnalitico: async (orcamentoId) => {
    const { data: itens, error } = await supabase
      .from('orcamento_itens')
      .select(`
        id,
        orcamento_id,
        quantidade,
        preco_unitario_congelado,
        insumos:item_id (
          id,
          codigo_item,
          descricao,
          unidade,
          preco_material,
          preco_mao_obra,
          base_id
        )
      `)
      .eq('orcamento_id', orcamentoId)
      .order('id');

    if (error) {
      console.error('Erro ao buscar itens (analítico):', error);
      throw new Error('Não foi possível gerar o relatório analítico. Verifique se há itens no orçamento.');
    }

    if (!itens || itens.length === 0) {
      throw new Error('Nenhum item encontrado no orçamento para gerar o relatório.');
    }

    return {
      tipo: 'ANALITICO',
      itens: itens.map((item, index) => {
        const fonte = item.insumos;
        if (!fonte) {
          console.warn(`Item ${item.id} não possui referência na base de dados`);
        }

        return {
          item: index + 1,
          codigo: fonte?.codigo_item || '---',
          descricao: fonte?.descricao || 'Item não encontrado na base',
          unidade: fonte?.unidade || '---',
          quantidade: parseFloat(item.quantidade) || 0,
          valorUnitario: item.preco_unitario_congelado ?? ((fonte?.preco_material || 0) + (fonte?.preco_mao_obra || 0)),
          valorTotal: (parseFloat(item.quantidade) || 0) * (item.preco_unitario_congelado ?? ((fonte?.preco_material || 0) + (fonte?.preco_mao_obra || 0))),
          base_referencia: fonte?.base_id ? `Base ${fonte.base_id}` : '---',
          detalhamento: [] // Removido temporariamente até implementarmos composições
        };
      })
    };
  },


  // Gera a Curva ABC
  gerarCurvaABC: async (orcamentoId, tipo = 'INSUMOS') => {
    try {
      // Buscar todos os itens do orçamento
      const { data: itens, error } = await supabase
        .from('orcamento_itens')
        .select(`
          id,
          orcamento_id,
          quantidade,
          preco_unitario_congelado,
insumos:item_id (
            id,
            codigo_item,
            descricao,
            unidade,
            preco_material,
            preco_mao_obra,
            base_id
          )
        `)
        .eq('orcamento_id', orcamentoId)
        // Removido filtro de COMPOSICAO para permitir análise de todos os tipos

      if (error) {
        console.error('Erro ao buscar itens (curva ABC):', error);
        throw new Error('Não foi possível gerar a Curva ABC. Verifique se há itens no orçamento.');
      }

      if (!itens || itens.length === 0) {
        throw new Error('Nenhum item encontrado no orçamento para gerar a Curva ABC.');
      }

      // Calcular o valor total de cada item
      const itensComValorTotal = itens.map((item, index) => {
        const fonte = item.insumos;
        if (!fonte) {
          console.warn(`Item ${item.id} não possui referência na base de dados`);
        }

        const valorUnitario = item.preco_unitario_congelado ?? ((fonte?.preco_material || 0) + (fonte?.preco_mao_obra || 0));
        const quantidade = parseFloat(item.quantidade) || 0;
        const valorTotal = quantidade * valorUnitario;
        
        return {
          item: index + 1,
          id: item.id,
          codigo: fonte?.codigo_item || '---',
          descricao: fonte?.descricao || 'Item não encontrado na base',
          unidade: fonte?.unidade || '---',
          quantidade,
          valorUnitario,
          valorTotal
        };
      });

      // Ordenar por valor total decrescente
      const itensOrdenados = itensComValorTotal.sort((a, b) => b.valorTotal - a.valorTotal);

      // Calcular o valor total do orçamento
      const valorTotalOrcamento = itensOrdenados.reduce((acc, item) => acc + item.valorTotal, 0);

      // Calcular percentuais e classificar
      let percentualAcumulado = 0;
      const itensCurvaABC = itensOrdenados.map(item => {
        const percentualItem = (item.valorTotal / valorTotalOrcamento) * 100;
        percentualAcumulado += percentualItem;
        
        return {
          ...item,
          percentualItem,
          percentualAcumulado,
          classe: percentualAcumulado <= 50 ? 'A' : percentualAcumulado <= 80 ? 'B' : 'C'
        };
      });

      return {
        tipo: 'CURVA_ABC',
        subTipo: tipo,
        itens: itensCurvaABC,
        totalOrcamento: valorTotalOrcamento
      };

    } catch (error) {
      console.error('Erro ao gerar curva ABC:', error);
      return null;
    }
  },

  // Exporta o relatório para PDF ou Excel
  exportarRelatorio: async (dados, formato) => {
    // Implementar lógica de exportação
    console.log('Exportando relatório:', formato);
  }
}));

export default useRelatoriosStore;