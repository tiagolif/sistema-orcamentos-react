import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './OrcamentoList.css';

const OrcamentoList = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      const { data, error } = await supabase
        .from('orcamentos')
        .select('id, nome_orcamento, valor_total, status, clientes(nome_completo, razao_social)');

      if (error) {
        setError(error.message);
        console.error('Error fetching orcamentos:', error);
      } else {
        setOrcamentos(data);
      }
    };

    fetchOrcamentos();
  }, []);

  if (error) {
    return <div className="error-message">Erro ao carregar orçamentos: {error}</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nº Orçamento</th>
          <th>Nome</th>
          <th>Cliente</th>
          <th>Valor Total</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {orcamentos.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.nome_orcamento}</td>
            <td>{item.clientes ? (item.clientes.nome_completo || item.clientes.razao_social) : 'Cliente não encontrado'}</td>
            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total)}</td>
            <td>{item.status}</td>
            <td>
              <button className="btn-action btn-edit">Editar</button>
              <button className="btn-action btn-delete">Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrcamentoList;
