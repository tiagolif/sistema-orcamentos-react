import React from 'react';
import useOrcamentoStore from '../../store/orcamentoStore.jsx';

const ResumoCabecalho = () => {
  const { bdiRate, totais } = useOrcamentoStore();

  // Dados fixos para simular o modelo, mas usando bdiRate e totalFinal da store
  const dados = {
    banco: 'SINAPI - 09/2025 - Santa Catarina',
    bdi: bdiRate,
    total: totais.totalFinal,
  };

  return (
    <div className="w-full max-w-sm p-4 border border-gray-200 rounded-lg">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Bancos</span>
          <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{dados.banco}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-gray-500">BDI</span>
          <span className="font-semibold">{dados.bdi.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-gray-500">Total</span>
          <span className="font-bold text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dados.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumoCabecalho;
