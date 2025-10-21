import React, { useState } from 'react';
import ResumoFinanceiro from './ResumoFinanceiro';
import { ChevronRightIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid'; // Import icons

const TabelaOrcamento = ({ itens, totais, bdiRate, activeAction }) => {
  const [expandedItems, setExpandedItems] = useState({}); // State to manage expanded/collapsed items

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderRow = (item, level) => {
    const isEtapa = item.tipo === 'ETAPA';
    const rowStyle = isEtapa ? 'bg-gray-100 font-bold' : '';
    const indentation = { paddingLeft: `${level * 1.5}rem` };
    const valorComBDI = item.valor_unitario * (1 + (bdiRate / 100));
    const hasChildren = itens.some(child => child.parent_id === item.id);
    const isSelected = activeAction && item.tipo.toLowerCase() === activeAction.toLowerCase();
    const selectedStyle = isSelected ? 'bg-accent text-white' : '';

    return (
      <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${rowStyle} ${selectedStyle}`}>
        <td className="px-4 py-1.5 w-8">
          {hasChildren && (
            <button onClick={() => toggleExpand(item.id)} className="focus:outline-none">
              {expandedItems[item.id] ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
        </td>
        <td className="px-4 py-1.5 w-16 text-left">{item.item}</td>
        <td className="px-4 py-1.5 w-24 text-left">{item.codigo}</td>
        <td className="px-4 py-1.5 w-20 text-left">{item.base}</td>
        <td className="px-4 py-1.5 w-1/3 text-left" style={indentation}>{item.descricao}</td>
        <td className="px-4 py-1.5 w-12 text-center">{item.unidade}</td>
        <td className="px-4 py-1.5 w-16 text-right">{item.quantidade}</td>
        <td className="px-4 py-1.5 w-24 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_unitario)}</td>
        <td className="px-4 py-1.5 w-24 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorComBDI)}</td>
        <td className="px-4 py-1.5 w-24 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * valorComBDI)}</td>
        <td className="px-4 py-1.5 w-8">
          <div className="flex items-center space-x-1">
            <button className="text-gray-400 hover:text-accent">
              <PencilIcon className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-red-500">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderTree = (parentId = null, level = 0) => {
    return itens
      .filter(item => item.parent_id === parentId)
      .flatMap(item => {
        const isExpanded = expandedItems[item.id];
        return [
          renderRow(item, level),
          ...(isExpanded ? renderTree(item.id, level + 1) : [])
        ];
      });
  };

  return (
    <div className="w-full">
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-primary text-white text-xs font-semibold uppercase">
                    <th className="px-4 py-1.5 w-8"></th> {/* Smaller empty column */}
                    <th className="px-4 py-1.5 w-16 text-left">ITEM</th>
                    <th className="px-4 py-1.5 w-24 text-left">CÓDIGO</th> {/* Slightly smaller */}
                    <th className="px-4 py-1.5 w-20 text-left">BASE</th> {/* Slightly smaller */}
                    <th className="px-4 py-1.5 w-1/3 text-left">DESCRIÇÃO</th> {/* Reduced width */}
                    <th className="px-4 py-1.5 w-12 text-center">UND</th> {/* Smaller */}
                    <th className="px-4 py-1.5 w-16 text-right">QUANT.</th> {/* Smaller */}
                    <th className="px-4 py-1.5 w-24 text-right">VALOR UNIT</th> {/* Slightly smaller */}
                    <th className="px-4 py-1.5 w-24 text-right">VALOR COM BDI</th> {/* Slightly smaller */}
                    <th className="px-4 py-1.5 w-24 text-right">TOTAL</th> {/* Slightly smaller */}
                    <th className="px-4 py-1.5 w-8"></th> {/* Smaller empty column */}
                </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="11" className="p-0">
                  <div className="flex justify-end py-4 pr-4">
                    <ResumoFinanceiro totais={totais} />
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody className="text-sm">
                {renderTree()}
            </tbody>
        </table>
    </div>
  );
};

export default TabelaOrcamento;