import React from 'react';
import { FaListUl, FaLayerGroup, FaCube } from 'react-icons/fa';

const ActionButton = ({ icon, label, action, activeAction, onActionClick }) => {
  const isActive = activeAction === action;
  return (
    <button
      onClick={() => onActionClick(action)}
      className={`flex items-center justify-center px-3 py-1.5 rounded-md shadow-sm w-full text-center transition-colors duration-200 ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
      }`}>
      <div className="text-lg mr-2">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const ToolbarSecundaria = ({ activeAction, onActionClick }) => {
  return (
    <div className="flex items-center space-x-2">
        <ActionButton
            icon={<FaListUl />}
            label="Etapa"
            action="etapa"
            activeAction={activeAction}
            onActionClick={onActionClick}
        />
        <ActionButton
            icon={<FaLayerGroup />}
            label="Composição"
            action="composicao"
            activeAction={activeAction}
            onActionClick={onActionClick}
        />
        <ActionButton
            icon={<FaCube />}
            label="Insumo"
            action="insumo"
            activeAction={activeAction}
            onActionClick={onActionClick}
        />
    </div>
  );
};

export default ToolbarSecundaria;
