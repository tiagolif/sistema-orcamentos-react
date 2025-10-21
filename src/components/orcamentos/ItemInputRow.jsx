import React, { useState, useEffect } from 'react';

const ItemInputRow = ({ onAddItem }) => {
  const [item, setItem] = useState({
    descricao: '',
    quantidade: 1,
    unidade: 'un',
    valor_unitario: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = (item.quantidade || 0) * (item.valor_unitario || 0);
    setTotal(newTotal);
  }, [item.quantidade, item.valor_unitario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!item.descricao) {
      console.warn('A descrição do item é obrigatória.');
      return;
    }
    onAddItem(item);
    // Reset form
    setItem({ descricao: '', quantidade: 1, unidade: 'un', valor_unitario: 0 });
  };

  return (
    <tr className="input-row">
      <td>
        <input type="text" name="descricao" placeholder="Descrição do item" value={item.descricao} onChange={handleChange} />
      </td>
      <td>
        <input type="number" name="quantidade" value={item.quantidade} onChange={handleChange} style={{ maxWidth: '80px' }} />
      </td>
      <td>
        <input type="text" name="unidade" value={item.unidade} onChange={handleChange} style={{ maxWidth: '70px' }} />
      </td>
      <td>
        <input type="number" name="valor_unitario" value={item.valor_unitario} onChange={handleChange} style={{ maxWidth: '120px' }} />
      </td>
      <td>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
      </td>
      <td>
        <Button type="button" variant="primary" onClick={handleAdd}>Adicionar</Button>
      </td>
    </tr>
  );
};

export default ItemInputRow;
