import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './NovoOrcamentoModal.css';

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
    <div className="modal-body">
      <div className="modal-header">
        <h2>Configurações do Novo Orçamento</h2>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="nome_orcamento">Nome do Orçamento</label>
          <input 
            id="nome_orcamento"
            type="text" 
            value={nomeOrcamento}
            onChange={(e) => setNomeOrcamento(e.target.value)}
            placeholder='Ex: Orçamento Casa Geminada 105m²'
          />
        </div>

        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razao_social || cliente.nome_completo}
              </option>
            ))}
          </select>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="base_custo">Base de Custo</label>
          <select id="base_custo" value={baseCusto} onChange={(e) => setBaseCusto(e.target.value)}>
            <option>SINAPI - SC (Caixa)</option>
            <option>Tabela Própria</option>
            <option>Orçamento Manual</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={handleCreate}>Criar Orçamento</button>
        </div>
      </form>
    </div>
  );
};

export default NovoOrcamentoModal;
