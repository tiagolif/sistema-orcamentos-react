import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './SupplierList.css';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching suppliers:', error);
      } else {
        setSuppliers(data);
      }
    };

    fetchSuppliers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .match({ id });

      if (error) {
        setError(error.message);
        console.error('Error deleting supplier:', error);
      } else {
        setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      }
    }
  };

  if (error) {
    return <div className="error-message">Erro ao carregar fornecedores: {error}</div>;
  }

  return (
    <table className="supplier-table">
      <thead>
        <tr>
          <th>RAZÃO SOCIAL / NOME</th>
          <th>CNPJ / CPF</th>
          <th>E-MAIL</th>
          <th>AÇÕES</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map(supplier => (
          <tr key={supplier.id}>
            <td>{supplier.razao_social || supplier.nome_completo}</td>
            <td>{supplier.cnpj || supplier.cpf}</td>
            <td>{supplier.email}</td>
            <td>
              <button onClick={() => handleEdit(supplier.id)} className="btn-action btn-edit">Editar</button>
              <button onClick={() => handleDelete(supplier.id)} className="btn-action btn-delete">Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SupplierList;