import React from 'react';

const RelatorioSintetico = ({ dados }) => {
  if (!dados?.itens?.length) {
    return <div>Nenhum dado para exibir</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Und
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quant.
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Unit.
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor c/ BDI
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dados.itens.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900">{item.item}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.codigo}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.descricao}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.unidade}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                {new Intl.NumberFormat('pt-BR').format(item.quantidade)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorUnitario)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorComBDI)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan="7" className="px-4 py-2 text-sm font-medium text-right">
              Total Geral:
            </td>
            <td className="px-4 py-2 text-sm font-medium text-right">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                dados.itens.reduce((acc, item) => acc + item.total, 0)
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default RelatorioSintetico;