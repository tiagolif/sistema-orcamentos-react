import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';
import NovaBaseModal from '../components/orcamentos/NovaBaseModal';

import BasesDePrecoList from '../components/bases/BasesDePrecoList';

// Componente da Página Principal
const BasesDePrecoPage = () => {
  const [bases, setBases] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBases = useCallback(async () => {
    const { data, error } = await supabase
      .from('bases_de_preco')
      .select('id, nome')
      .order('id');

    if (error) {
      setError(error.message);
      console.error('Error fetching bases:', error);
    } else {
      setBases(data);
    }
  }, []);

  useEffect(() => {
    fetchBases();
  }, [fetchBases]);

  const handleSaveNovaBase = () => {
    setIsModalOpen(false);
    fetchBases(); // Refetch a lista após salvar
  };

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar bases de preço: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Bases de Preço</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Adicionar Nova Base
        </Button>
      </div>
      
      <BasesDePrecoList bases={bases} />

      <NovaBaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNovaBase}
      />
    </div>
  );
};

export default BasesDePrecoPage;
