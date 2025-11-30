import React, { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'auto' /* Garante que o clique funcione */
    }}>
      
      {/* Janela de Teste */}
      {isOpen && (
        <div style={{
          width: '300px',
          height: '200px',
          backgroundColor: 'white',
          border: '5px solid red',
          marginBottom: '10px',
          padding: '10px',
          color: 'black'
        }}>
          <h3>ESTOU FUNCIONANDO!</h3>
          <p>Se você vê isso, o componente está montado.</p>
        </div>
      )}

      {/* Botão de Teste */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          border: '4px solid yellow',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        TESTE
      </button>
    </div>
  );
}