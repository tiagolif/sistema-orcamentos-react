
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, Send, X } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-96 h-[600px] rounded-lg shadow-2xl flex flex-col">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg border-b">
            <h3 className="font-bold text-lg text-gray-800">Arquiteto Virtual</h3>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
          </div>

          {/* Mensagens */}
          <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 && (
                <div className="text-center text-gray-500">
                    Converse comigo sobre o ERP!
                </div>
            )}
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                    m.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
             {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg shadow">
                        Digitando...
                    </div>
                </div>
             )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte sobre o sistema..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isLoading || !input.trim()}
                aria-label="Enviar mensagem"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
