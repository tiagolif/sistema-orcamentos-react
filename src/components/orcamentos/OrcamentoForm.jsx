import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './OrcamentoForm.css';
import ItemInputRow from './ItemInputRow';

const OrcamentoForm = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [orcamento, setOrcamento] = useState({
    nome_orcamento: '',
    cliente_id: '',
    data_emissao: new Date().toISOString().split('T')[0],
    data_validade: '',
    base_custo_utilizada: 'SINAPI - SC (Caixa)',
    desconto: 0,
    acrescimo: 0,
    condicoes_pagamento: 'A combinar',
    observacoes: '',
  });
  const [itens, setItens] = useState([]);

  // --- Cálculos --- //
  const subtotal = useMemo(() => {
    return itens.reduce((total, item) => total + item.valor_total_item, 0);
  }, [itens]);

  const valorTotalFinal = useMemo(() => {
    return subtotal - (parseFloat(orcamento.desconto) || 0) + (parseFloat(orcamento.acrescimo) || 0);
  }, [subtotal, orcamento.desconto, orcamento.acrescimo]);


  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('id, nome_completo, razao_social');
      if (!error) setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setOrcamento(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (newItem) => {
    const valor_total_item = newItem.quantidade * newItem.valor_unitario;
    setItens(prev => [...prev, { ...newItem, valor_total_item, id: Date.now() }]);
  };

  const handleDeleteItem = (id) => {
    setItens(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orcamento.cliente_id) {
      alert('Por favor, selecione um cliente.');
      return;
    }

    const orcamentoData = { ...orcamento, valor_total: valorTotalFinal, subtotal: subtotal };
    const { data: orcamentoResult, error: orcamentoError } = await supabase
      .from('orcamentos')
      .insert(orcamentoData)
      .select('id')
      .single();

    if (orcamentoError) {
      console.error('Erro ao salvar orçamento:', orcamentoError);
      alert(`Erro ao salvar orçamento: ${orcamentoError.message}`);
      return;
    }

    const orcamento_id = orcamentoResult.id;
    const itensData = itens.map(({ id, ...item }) => ({ ...item, orcamento_id }));

    const { error: itensError } = await supabase.from('orcamento_itens').insert(itensData);

    if (itensError) {
      console.error('Erro ao salvar itens:', itensError);
      alert(`Erro ao salvar itens: ${itensError.message}`);
    } else {
      alert('Orçamento salvo com sucesso!');
      navigate('/orcamentos');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Novo Orçamento</h2>
        
        {/* Dados Gerais */}
        <div className="form-section">
          <p className="form-section-title">Dados Gerais</p>
          <div className="form-grid">
            <div className="form-group col-span-6"><label>Nome do Orçamento</label><input type="text" name="nome_orcamento" value={orcamento.nome_orcamento} onChange={handleHeaderChange} required /></div>
            <div className="form-group col-span-6"><label>Cliente</label><select name="cliente_id" value={orcamento.cliente_id} onChange={handleHeaderChange} required><option value="" disabled>Selecione um cliente</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.razao_social || c.nome_completo}</option>)}</select></div>
            <div className="form-group col-span-4"><label>Data de Emissão</label><input type="date" name="data_emissao" value={orcamento.data_emissao} onChange={handleHeaderChange} /></div>
            <div className="form-group col-span-4"><label>Data de Validade</label><input type="date" name="data_validade" value={orcamento.data_validade} onChange={handleHeaderChange} /></div>
            <div className="form-group col-span-4"><label>Base de Custo</label><select name="base_custo_utilizada" value={orcamento.base_custo_utilizada} onChange={handleHeaderChange}><option>SINAPI - SC (Caixa)</option><option>Tabela Própria</option><option>Orçamento Manual</option></select></div>
          </div>
        </div>

        {/* Itens do Orçamento */}
        <div className="form-section">
          <p className="form-section-title">Itens do Orçamento</p>
          <table className="data-table">
            <thead><tr><th style={{width: '40%'}}>Descrição</th><th>Qtd</th><th>Un</th><th>Valor Unit.</th><th>Valor Total</th><th>Ações</th></tr></thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.id}>
                  <td>{item.descricao}</td><td>{item.quantidade}</td><td>{item.unidade}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_unitario)}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total_item)}</td>
                  <td><button type="button" className="btn-action btn-edit">Editar</button><button type="button" className="btn-action btn-delete" onClick={() => handleDeleteItem(item.id)}>Excluir</button></td>
                </tr>
              ))}
              <ItemInputRow onAddItem={handleAddItem} />
            </tbody>
          </table>
        </div>

        {/* Seção de Totais e Campos Finais */}
        <div className="form-body-grid" style={{ marginTop: '2rem' }}>
          {/* Coluna Esquerda: Campos Comerciais */}
          <div className="form-section">
            <p className="form-section-title">Condições e Observações</p>
            <div className="form-grid">
                <div className="form-group col-span-12"><label>Condições de Pagamento</label><input type="text" name="condicoes_pagamento" value={orcamento.condicoes_pagamento} onChange={handleHeaderChange} /></div>
                <div className="form-group col-span-12"><label>Observações</label><textarea name="observacoes" value={orcamento.observacoes} onChange={handleHeaderChange} rows={4}></textarea></div>
            </div>
          </div>

          {/* Coluna Direita: Totais */}
          <div className="form-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p className="form-section-title">Totais</p>
            <div className="totals-grid">
                <div className="total-row"><span>Subtotal:</span><span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span></div>
                <div className="total-row input-row"><label>Desconto (-):</label><input type="number" name="desconto" value={orcamento.desconto} onChange={handleHeaderChange} /></div>
                <div className="total-row input-row"><label>Acréscimo (+):</label><input type="number" name="acrescimo" value={orcamento.acrescimo} onChange={handleHeaderChange} /></div>
                <div className="total-row final-total"><span>Valor Total:</span><span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalFinal)}</span></div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orcamentos')}>Voltar</button>
          <button type="submit" className="btn btn-primary">Salvar Orçamento</button>
        </div>
      </form>
    </div>
  );
};

export default OrcamentoForm;
