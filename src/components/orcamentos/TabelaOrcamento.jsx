import React, { useState, useEffect } from 'react';
import ResumoFinanceiro from './ResumoFinanceiro';
import { ChevronRightIcon, ChevronDownIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import ItemSearchRow from './ItemSearchRow';
import SuggestionInput from '../ui/SuggestionInput';
import etapasPadrao from '../../data/etapasPadrao';
import useOrcamentoStore from '../../store/orcamentoStore';
import RelatoriosModal from '../relatorios/RelatoriosModal';

const TabelaOrcamento = ({ itens, totais, bdiRate, activeAction, onActionClick, adicionarEtapa, excluirItem, selectedId, onRowClick }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [newEtapaDesc, setNewEtapaDesc] = useState('');
  const [showRelatorios, setShowRelatorios] = useState(false);
  const numericalBdiRate = parseFloat(bdiRate) || 0;

  const topLevelEtapas = etapasPadrao.map(etapa => ({ id: etapa.id, name: etapa.name }));

  useEffect(() => {
    if (activeAction !== 'etapa') {
      setNewEtapaDesc('');
    }
  }, [activeAction]);

  useEffect(() => {
    const searchItem = itens.find(item => item.tipo === 'SEARCHING');
    if (searchItem && searchItem.parent_id) {
      setExpandedItems(prev => ({ ...prev, [searchItem.parent_id]: true }));
    }
  }, [itens]);

  const handleSaveNewEtapa = () => {
    if (newEtapaDesc.trim()) {
      adicionarEtapa(newEtapaDesc);
      setNewEtapaDesc('');
      onActionClick(null);
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveNewEtapa();
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const atualizarItemBusca = useOrcamentoStore(state => state.atualizarItemBusca);

  const renderRow = (item) => {
    if (item.tipo === 'SEARCHING') {
      return (
        <tr key={item.id}>
          <ItemSearchRow 
            item={item} 
            onCancel={() => excluirItem(item.id)} 
            onSave={(composicaoData, qtde) => atualizarItemBusca(item.id, composicaoData, qtde)}
          />
        </tr>
      );
    }

    const isEtapa = item.tipo === 'ETAPA';
    const isSelected = item.id === selectedId;
    const hasChildren = itens.some(child => child.parent_id === item.id);

    const rowClasses = [
      'border-b',
      'border-gray-200',
      'hover:bg-gray-100',
      'cursor-pointer',
      'text-xs',
      isEtapa ? 'bg-orange-200 font-semibold' : item.tipo === 'COMPOSICAO' ? 'bg-orange-100' : 'bg-gray-200',
      isSelected ? 'ring-1 ring-orange-500 bg-orange-50' : ''
    ].filter(Boolean).join(' ');

    const indentation = { paddingLeft: `${(item.level || 0) * 1.25}rem` };

    return (<tr 
        key={item.id} 
        onClick={() => onRowClick(item.id)}
        className={rowClasses}>
        <td className="px-2 py-1 w-8" onClick={(e) => e.stopPropagation()}>
          {hasChildren ? (
            <button onClick={() => toggleExpand(item.id)} className="focus:outline-none">
              {expandedItems[item.id] ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="inline-block w-4">{isEtapa ? '' : <ClipboardDocumentListIcon className="h-4 w-4 text-gray-900"/>}</span>
          )}
        </td>
        <td className="px-2 py-1 w-16 text-left">{item.numero}</td>
        <td className="px-2 py-1 w-16 text-left">{item.codigo}</td>
        <td className="px-2 py-1 w-24 text-left">{item.base}</td>
        <td className="px-2 py-1 w-1/3 text-left" style={indentation}>{item.descricao}</td>
        <td className="px-2 py-1 w-12 text-center">{item.unidade}</td>
        <td className="px-2 py-1 w-16 text-right">{isEtapa ? '' : item.quantidade}</td>
        <td className="px-2 py-1 w-24 text-right">{isEtapa ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(item.valor_unitario) || 0)}</td>
        <td className="px-2 py-1 w-24 text-right">{isEtapa ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(item.valor_mao_de_obra) || 0)}</td>
        <td className="px-2 py-1 w-24 text-right">{isEtapa ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((parseFloat(item.valor_unitario) || 0) * (1 + numericalBdiRate / 100))}</td>
        <td className="px-2 py-1 w-24 text-right font-bold">{isEtapa ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((parseFloat(item.valor_unitario) || 0) * (parseFloat(item.quantidade) || 0) * (1 + numericalBdiRate / 100))}</td>
        <td className="px-2 py-1 w-8" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-1">
            <button className="text-gray-400 hover:text-accent">
              <PencilIcon className="h-4 w-4" />
            </button>
            <button onClick={() => excluirItem(item.id)} className="text-gray-400 hover:text-red-500">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const getRenderableItems = () => {
    const itemMap = {};
    itens.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });

    const rootItems = [];
    const childItems = [];

    itens.forEach(item => {
      if (item.tipo === 'ETAPA' || (item.tipo === 'SEARCHING' && item.parent_id === null)) {
        rootItems.push(itemMap[item.id]);
      } else {
        childItems.push(item);
      }
    });

    const orphanedChildren = [];

    childItems.forEach(item => {
      if (item.parent_id && itemMap[item.parent_id]) {
        itemMap[item.parent_id].children.push(itemMap[item.id]);
      } else {
        orphanedChildren.push(itemMap[item.id]);
      }
    });

    if (orphanedChildren.length > 0) {
      const virtualEtapa = {
        id: 'virtual-etapa-orphans',
        tipo: 'ETAPA',
        descricao: 'Composições sem Etapa Definida',
        children: orphanedChildren,
        codigo: '--',
        base: '--',
        unidade: '--',
        quantidade: ''
      };
      rootItems.push(virtualEtapa);
    }

    rootItems.sort((a, b) => {
      if (a.id === 'virtual-etapa-orphans') return 1;
      if (b.id === 'virtual-etapa-orphans') return -1;
      return a.id - b.id;
    });

    const bdiValue = parseFloat(bdiRate) || 0;
    const calculateTotals = (item) => {
      const isComposition = item.tipo !== 'ETAPA' && item.tipo !== 'SEARCHING';

      if (isComposition) {
        const valorComBDI = (item.valor_unitario || 0) * (1 + (bdiValue / 100));
        item.calculated_valor_com_bdi = valorComBDI;
        item.calculated_total = (item.quantidade || 0) * valorComBDI;
        return item.calculated_total;
      }

      if (item.children && item.children.length > 0) {
        const childrenTotal = item.children.reduce((sum, child) => {
          return sum + calculateTotals(child);
        }, 0);
        item.calculated_total = childrenTotal;
        return item.calculated_total;
      }

      item.calculated_total = 0;
      return 0;
    };

    rootItems.forEach(root => calculateTotals(root));

    const renderList = [];
    const generateList = (itemsToProcess, level, parentNumber) => {
      itemsToProcess.sort((a, b) => a.id - b.id);

      itemsToProcess.forEach((item, index) => {
        const currentNumber = level === 0 ? `${index + 1}` : `${parentNumber}.${index + 1}`;
        item.numero = currentNumber;
        item.level = level;
        renderList.push(item);

        if (expandedItems[item.id] && item.children.length > 0) {
          generateList(item.children, level + 1, currentNumber);
        }
      });
    };

    generateList(rootItems, 0, '');
    return renderList;
  };

  const renderableItems = getRenderableItems();

  return (
    <div className="w-full">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowRelatorios(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Relatórios
          </button>
        </div>

        <RelatoriosModal
          isOpen={showRelatorios}
          onClose={() => setShowRelatorios(false)}
        />

        <table className="w-full border-collapse">
            <thead className="bg-primary border-b border-gray-200">
                <tr className="text-white text-xs uppercase">
                    <th className="px-2 py-1 w-8"></th>
                    <th className="px-2 py-1 w-16 text-left font-medium">ITEM</th>
                    <th className="px-2 py-1 w-16 text-left font-medium">CÓDIGO</th>
                    <th className="px-2 py-1 w-24 text-left font-medium">BASE</th>
                    <th className="px-2 py-1 w-1/3 text-left font-medium">DESCRIÇÃO</th>
                    <th className="px-2 py-1 w-12 text-center font-medium">UND</th>
                    <th className="px-2 py-1 w-16 text-right font-medium">QUANT.</th>
                    <th className="px-2 py-1 w-24 text-right font-medium">VALOR UNIT</th>
                    <th className="px-2 py-1 w-24 text-right font-medium">VALOR MÃO OBRA</th>
                    <th className="px-2 py-1 w-24 text-right font-medium">VALOR COM BDI</th>
                    <th className="px-2 py-1 w-24 text-right font-medium">TOTAL COM BDI</th>
                    <th className="px-2 py-1 w-8"></th>
                </tr>
            </thead>
            <tbody className="text-xs">
                {activeAction === 'etapa' && (
                  <tr key="nova-etapa-row" className="bg-yellow-50">
                    <td className="px-2 py-1" colSpan="12">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-600">Nova Etapa:</span>
                        <SuggestionInput
                          value={newEtapaDesc}
                          onChange={setNewEtapaDesc}
                          onSelect={setNewEtapaDesc}
                          suggestions={topLevelEtapas}
                          placeholder="Digite a descrição da nova etapa"
                          className="flex-grow text-sm"
                          onKeyDown={handleInputKeyDown}
                        />
                        <button onClick={handleSaveNewEtapa} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">Salvar</button>
                        <button onClick={() => onActionClick(null)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">Cancelar</button>
                      </div>
                    </td>
                  </tr>
                )}
                {renderableItems.map(item => renderRow(item))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="12" className="p-0">
                  <div className="flex justify-end py-2 pr-2 bg-gray-50">
                    <ResumoFinanceiro totais={totais} />
                  </div>
                </td>
              </tr>
            </tfoot>
        </table>
    </div>
  );
};

export default TabelaOrcamento;
