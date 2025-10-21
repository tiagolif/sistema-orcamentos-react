import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path if necessary

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch

      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome_completo, razao_social, cpf, cnpj, email');

      if (error) {
        setError(error.message);
        console.error('Error fetching clients:', error);
      } else {
        // Mapeia os dados usando as colunas corretas para o nome
        const formattedData = (data || []).map(c => ({
          id: c.id,
          name: c.nome_completo || c.razao_social,
          document: c.cpf || c.cnpj,
          email: c.email || 'N/A',
        }));
        setClients(formattedData);
      }
      setLoading(false);
    };

    fetchClients();
  }, []); // Empty dependency array means this runs once on mount

  return { clients, loading, error };
};

export default useClients;
