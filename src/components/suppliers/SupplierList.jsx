import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../ui/Button';

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
    return <div className="text-red-500">Erro ao carregar fornecedores: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse mt-6">
        <thead>
        <tr>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">RAZÃO SOCIAL / NOME</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">CNPJ / CPF</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">E-MAIL</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">AÇÕES</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map(supplier => (
          <tr key={supplier.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{supplier.razao_social || supplier.nome_completo}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{supplier.cnpj || supplier.cpf}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">{supplier.email}</td>
            <td className="py-3 px-4 text-sm font-normal text-gray-800">
              <Link to={`/fornecedores/visualizar/${supplier.id}`} className="btn-secondary">Visualizar</Link>
              <Button onClick={() => handleEdit(supplier.id)} variant="ghost">Editar</Button>
              <Button onClick={() => handleDelete(supplier.id)} variant="danger">Excluir</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default SupplierList;