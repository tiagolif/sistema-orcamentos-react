import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { supabase } from '../supabaseClient';
import FormNovoBoletim from './medicoes/FormNovoBoletim.jsx';

const MedicoesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boletins, setBoletins] = useState([]);

  const fetchBoletins = async () => {
    const { data, error } = await supabase
      .from('medicoes_boletins')
      .select(`
        *,
        obras (
          nome_obra
        )
      `);
    if (error) {
      console.error('Error fetching boletins:', error);
    } else {
      setBoletins(data);
    }
  };

  useEffect(() => {
    fetchBoletins();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Boletins de Medição</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          Novo Boletim
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Boletins</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">Obra</th>
              <th className="py-2 px-4 text-left">Mês Referência</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {boletins.map((boletim) => (
              <tr key={boletim.id}>
                <td className="py-2 px-4">{boletim.obras.nome_obra}</td>
                <td className="py-2 px-4">{new Date(boletim.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                <td className="py-2 px-4">{boletim.status}</td>
                <td className="py-2 px-4 text-center">
                  <Button variant="secondary" size="sm">Detalhes</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormNovoBoletim
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MedicoesPage;
