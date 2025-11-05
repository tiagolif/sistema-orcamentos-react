import React, { useState } from 'react';
import useRelatoriosStore from '../../store/relatoriosStore.jsx';
import useOrcamentoStore from '../../store/orcamentoStore.jsx';

const RelatoriosModal = ({ isOpen, onClose }) => {
  const [tipoRelatorio, setTipoRelatorio] = useState('SINTETICO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatorioGerado, setRelatorioGerado] = useState(null);
  const orcamentoAtual = useOrcamentoStore(state => state.dadosGerais);
  const gerarRelatorioSintetico = useRelatoriosStore(state => state.gerarRelatorioSintetico);
  const gerarRelatorioAnalitico = useRelatoriosStore(state => state.gerarRelatorioAnalitico);
  const gerarCurvaABC = useRelatoriosStore(state => state.gerarCurvaABC);

  const handleGerarRelatorio = async () => {
    if (!orcamentoAtual?.id) {
      console.log('Nenhum orçamento selecionado');
      return;
    }
    
    console.log('Gerando relatório para orçamento:', orcamentoAtual.id);
    setLoading(true);
    try {
      let relatorio;
      switch (tipoRelatorio) {
        case 'SINTETICO':
          relatorio = await gerarRelatorioSintetico(orcamentoAtual.id);
          break;
        case 'ANALITICO':
          relatorio = await gerarRelatorioAnalitico(orcamentoAtual.id);
          break;
        case 'CURVA_ABC':
          relatorio = await gerarCurvaABC(orcamentoAtual.id);
          break;
        default:
          console.error('Tipo de relatório não suportado');
          return;
      }
      
      // Armazena o relatório gerado no estado
      setRelatorioGerado(relatorio);
      setError(null);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError(error);
      setRelatorioGerado(null);
    } finally {
      setLoading(false);
    }
  };

  // Limpa estados ao fechar
  const handleClose = () => {
    setError(null);
    setRelatorioGerado(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Relatórios</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Tipo de Relatório</h3>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading}
            >
              <option value="SINTETICO">Sintético</option>
              <option value="ANALITICO">Analítico</option>
              <option value="CURVA_ABC">Curva ABC</option>
            </select>
          </div>

          {/* Área de status/erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <p className="font-medium">Erro ao gerar relatório</p>
              <p className="text-sm mt-1">{error.message || 'Tente novamente ou verifique se há itens no orçamento.'}</p>
            </div>
          )}

          {/* Área de carregamento */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Gerando relatório...</p>
            </div>
          )}

          {/* Área do relatório */}
          {!loading && relatorioGerado === null && !error && (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-gray-600">
                Clique em "Gerar Relatório" para visualizar os dados do orçamento.
              </p>
            </div>
          )}

          {/* Prévia do relatório gerado */}
          {!loading && relatorioGerado && (
            <div className="border rounded p-4">
              <h4 className="font-medium mb-2">Relatório {tipoRelatorio.toLowerCase()}</h4>
              <div className="text-sm text-gray-600">
                {relatorioGerado.itens?.length} item(s) encontrado(s)
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleGerarRelatorio}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosModal;