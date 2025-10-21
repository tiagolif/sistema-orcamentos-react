import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoSettingsOutline } from 'react-icons/io5'; // Assuming react-icons is installed

const ThemeModal = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const themes = [
    { name: 'moderno', label: 'Moderno e Acolhedor' },
    { name: 'confianca', label: 'Confiança Energizada' },
    { name: 'crescimento', label: 'Crescimento e Clareza' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Selecionar Tema</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="mt-2 flex flex-col gap-3">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setTheme(t.name);
                onClose();
              }}
              className={`p-3 rounded-md text-left font-semibold transition-all duration-200
                ${theme === t.name
                  ? 'bg-accent text-accent-text border-2 border-accent'
                  : 'bg-gray-100 text-text-primary hover:bg-gray-200 border-2 border-transparent'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;