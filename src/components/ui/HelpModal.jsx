import React from 'react';
import Button from './Button';

const HelpModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{title || 'Ajuda'}</h2>
        <div className="prose max-w-none">
          {children}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
