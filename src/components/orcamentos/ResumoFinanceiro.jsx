import React from 'react';

const ResumoFinanceiro = ({ totais }) => {
  return (
    <div className="w-auto text-sm">
      <div className="space-y-2">
        <div className="flex justify-between w-64">
          <span className="text-gray-600">Total sem BDI</span>
          <span className="font-medium text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalSemBDI)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total do BDI</span>
          <span className="font-medium text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalBDI)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t mt-2">
          <span className="">TOTAL</span>
          <span className="text-blue-600 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalFinal)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumoFinanceiro;
