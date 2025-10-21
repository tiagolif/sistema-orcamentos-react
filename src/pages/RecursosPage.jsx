import React from 'react';
import { Link } from 'react-router-dom';
import RecursosList from '../components/recursos/RecursosList';
import Button from '../components/ui/Button.jsx';
import RecursoFiltros from '../components/recursos/RecursoFiltros.jsx';

const RecursosPage = () => {
  return (
    <div className="p-6"> {/* Replaced list-page-container with padding */}
      <div className="flex justify-between items-center mb-8"> {/* Replaced list-page-header with flexbox for alignment */}
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Recursos</h1> {/* Tailwind for heading */}
        <Link to="/recursos/novo">
          <Button variant="primary"> {/* Using the Button component */}
            Adicionar Recurso
          </Button>
        </Link>
      </div>
      <RecursoFiltros />
      <div className="bg-white shadow-md rounded-lg p-4"> {/* Replaced list-page-content with card-like styling */}
        <RecursosList />
      </div>
    </div>
  );
};

export default RecursosPage;
