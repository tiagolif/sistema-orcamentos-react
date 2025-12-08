import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat', // Certifique-se que a rota da sua API está correta
  });

  const messagesContainerRef = useRef(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div 
          style={{ zIndex: 9999 }} 
          className="fixed bottom-24 right-6 w-80 md:w-96 h-[450px] md:h-[600px] bg-white rounded-lg shadow-2xl flex flex-col"
        >
          {/* Cabeçalho */}
          <div className="flex items-center p-4 bg-gray-100 rounded-t-lg border-b">
            <Bot className="text-blue-600 mr-3" size={24} />
            <h3 className="font-bold text-lg text-gray-800">Arquiteto Virtual</h3>
          </div>

          {/* Mensagens */}
          <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                    <Bot size={40} className="mb-2 text-gray-400" />
                    <p>Converse comigo sobre o ERP!</p>
                </div>
            )}
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex items-start gap-3 mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && <Bot className="text-blue-600 flex-shrink-0" size={24} />}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{m.content || ''}</p>
                </div>
                {m.role === 'user' && <User className="text-white bg-blue-500 rounded-full p-1 flex-shrink-0" size={24} />}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <Bot className="text-blue-600 flex-shrink-0" size={24} />
                    <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg shadow-sm">
                        Digitando...
                    </div>
                </div>
             )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte sobre o sistema..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                disabled={isLoading || !(input || '').trim()}
                aria-label="Enviar mensagem"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
