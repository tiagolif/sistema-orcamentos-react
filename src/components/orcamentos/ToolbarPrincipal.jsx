import React from 'react';
import { FaSave, FaFileExport, FaFileImport, FaPrint, FaCog } from 'react-icons/fa';

const ToolbarButton = ({ icon, label }) => (
  <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
    {icon}
    <span>{label}</span>
  </button>
);

const ToolbarPrincipal = () => {
  return (
    <div className="flex items-center space-x-2">
      <ToolbarButton icon={<FaSave />} label="Salvar" />
      <ToolbarButton icon={<FaSave />} label="Salvar Como" />
      <ToolbarButton icon={<FaPrint />} label="Gerar Relatório" />
      <ToolbarButton icon={<FaFileImport />} label="Importar" />
      <ToolbarButton icon={<FaFileExport />} label="Exportar" />
      <ToolbarButton icon={<FaCog />} label="Configurações" />
    </div>
  );
};

export default ToolbarPrincipal;
