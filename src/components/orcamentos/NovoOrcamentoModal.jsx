import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Button from '../ui/Button'; // Import Button component
import Input from '../ui/Input';   // Import Input component

const NovoOrcamentoModal = ({ onClose }) => {
  const [nomeOrcamento, setNomeOrcamento] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [baseCusto, setBaseCusto] = useState('SINAPI - SC (Caixa)');
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome_completo, razao_social');

      if (error) {
        console.error('Error fetching clientes:', error);
        setError('Não foi possível carregar os clientes.');
      } else {
        setClientes(data);
      }
    };

    fetchClientes();
  }, []);

  const handleCreate = () => {
    // Lógica para criar o orçamento será implementada aqui
    console.log({ nomeOrcamento, clienteId, baseCusto });
    onClose(); // Fecha a modal por enquanto
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative outline-none"> {/* modal-body, modal-content */}
      <div className="flex justify-between items-center mb-6"> {/* modal-header */}
        <h2 className="text-lg font-semibold m-0">Configurações do Novo Orçamento</h2>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col mb-4"> {/* form-group */}
          <label htmlFor="nome_orcamento" className="mb-2 font-medium">Nome do Orçamento</label>
          <Input
            id="nome_orcamento"
            type="text"
            value={nomeOrcamento}
            onChange={(e) => setNomeOrcamento(e.target.value)}
            placeholder='Ex: Orçamento Casa Geminada 105m²'
            className="w-full py-2 px-3 text-base border border-gray-300 rounded-md bg-gray-50" // modal-body input
          />
        </div>

        <div className="flex flex-col mb-4"> {/* form-group */}
          <label htmlFor="cliente" className="mb-2 font-medium">Cliente</label>
          <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required
            className="w-full py-2 px-3 text-base border border-gray-300 rounded-md bg-gray-50" // modal-body select
          >
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razao_social || cliente.nome_completo}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* error-message */}
        </div>

        <div className="flex flex-col mb-4"> {/* form-group */}
          <label htmlFor="base_custo" className="mb-2 font-medium">Base de Custo</label>
          <select id="base_custo" value={baseCusto} onChange={(e) => setBaseCusto(e.target.value)}
            className="w-full py-2 px-3 text-base border border-gray-300 rounded-md bg-gray-50" // modal-body select
          >
            <option>SINAPI - SC (Caixa)</option>
            <option>Tabela Própria</option>
            <option>Orçamento Manual</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6"> {/* modal-actions */}
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={handleCreate}>Criar Orçamento</Button>
        </div>
      </form>
    </div>
  );
};

export default NovoOrcamentoModal;