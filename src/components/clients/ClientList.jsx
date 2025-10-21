import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import useClients from "../../hooks/useClients.js";
import Button from '../ui/Button'; // Import the Button component

const ClientList = () => {
  const { clients, loading, error } = useClients(); // Use the new hook

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const { error: deleteError } = await supabase.from('clientes').delete().eq('id', id);

      if (deleteError) {
        console.error(`Erro ao excluir cliente: ${deleteError.message}`);
      } else {
        console.log('Cliente excluído com sucesso!');
        // A more robust solution would involve useClients returning a refetch function
        // or ClientList managing its own filtered list based on clients from the hook.
      }
    }
  };

  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  if (error) {
    return <p>Erro ao carregar clientes: {error}</p>;
  }

  return (
    <table className="w-full border-collapse mt-6 bg-white rounded-lg overflow-hidden shadow-md"><thead><tr><th className="py-3 px-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Nome / Razão Social</th>
          <th className="py-3 px-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">CPF / CNPJ</th>
          <th className="py-3 px-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">E-mail</th>
          <th className="py-3 px-4 text-left bg-white text-gray-400 font-semibold uppercase text-sm tracking-wider">Ações</th>
        </tr></thead>
      <tbody>{clients.map(client => (
          <tr key={client.id} className="border-b border-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100">
            <td className="py-3 px-4 text-base">{client.name}</td>
            <td className="py-3 px-4 text-base">{client.document}</td>
            <td className="py-3 px-4 text-base">{client.email}</td>
            <td className="py-3 px-4 text-base">
              <Link to={`/clientes/editar/${client.id}`} className="inline-block px-2 py-1 mx-1 font-semibold rounded-md transition-all duration-200 ease-in-out text-accent hover:bg-accent/10">Editar</Link>
              <Button onClick={() => handleDelete(client.id)} variant="danger">Excluir</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientList;
