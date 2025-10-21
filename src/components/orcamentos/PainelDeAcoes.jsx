import React from 'react';
import { FaListUl, FaLayerGroup, FaCube } from 'react-icons/fa';

const ActionCard = ({ icon, title, subtitle, action, activeAction, onActionClick }) => {
  const isActive = activeAction === action;
  
  // Classes base para todos os cards
  const baseClasses = 'flex flex-col items-center justify-center p-4 border cursor-pointer transition-colors duration-200 w-44 h-28 text-center';

  // Classes condicionais para estado ativo vs. inativo
  const stateClasses = isActive
    ? 'bg-accent border-accent text-white'
    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-text-primary';

  return (
    <div onClick={() => onActionClick(action)} className={`${baseClasses} ${stateClasses}`}>
      <div className={`text-3xl mb-2 ${isActive ? 'text-white' : 'text-text-primary'}`}>{icon}</div>
      <span className={`text-xs ${isActive ? 'text-secondary' : 'text-text-secondary'}`}>{title}</span>
      <span className="text-sm font-semibold">{subtitle}</span>
    </div>
  );
};

const PainelDeAcoes = ({ activeAction, onActionClick }) => {
  return (
    <div className="flex items-center space-x-4">
      <ActionCard
        icon={<FaListUl />}
        title="Adicionar"
        subtitle="Etapa"
        action="etapa"
        activeAction={activeAction}
        onActionClick={onActionClick}
      />
      <ActionCard
        icon={<FaLayerGroup />}
        title="Adicionar"
        subtitle="Composição"
        action="composicao"
        activeAction={activeAction}
        onActionClick={onActionClick}
      />
      <ActionCard
        icon={<FaCube />}
        title="Adicionar"
        subtitle="Insumo"
        action="insumo"
        activeAction={activeAction}
        onActionClick={onActionClick}
      />
    </div>
  );
};

export default PainelDeAcoes;
