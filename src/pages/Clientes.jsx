import React from 'react';
import { Link } from 'react-router-dom';
import ClientList from '../components/clients/ClientList.jsx';
import Button from '../components/ui/Button.jsx';
import ClientFiltros from '../components/clients/ClientFiltros.jsx'; // Import the Button component

const Clientes = () => {
  return (
    <div className="p-6"> {/* Replaced list-page-container with padding */}
      <div className="flex justify-between items-center mb-6"> {/* Replaced list-page-header with flexbox for alignment */}
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1> {/* Tailwind for heading */}
        <Link to="/clientes/novo">
          <Button> {/* Using the Button component */}
            Adicionar Novo Cliente
          </Button>
        </Link>
      </div>
      <ClientFiltros />
      <div className="bg-white shadow-md rounded-lg p-4"> {/* Replaced list-page-content with card-like styling */}
        <ClientList />
      </div>
    </div>
  );
};

export default Clientes;
