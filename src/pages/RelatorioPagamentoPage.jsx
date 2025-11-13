import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RelatorioPagamentoPage = () => {
  const [recursos, setRecursos] = useState([]);
  const [selectedRecursoId, setSelectedRecursoId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecursos = async () => {
      const { data, error } = await supabase
        .from('recursos_humanos')
        .select('id, nome_completo, funcao, custo_hora, custo_diaria');
      if (error) {
        console.error('Error fetching recursos:', error);
      } else {
        setRecursos(data);
      }
    };
    fetchRecursos();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);

    if (!selectedRecursoId) {
      setError('Por favor, selecione um recurso.');
      setLoading(false);
      return;
    }

    try {
      // Fetch resource details for costs
      const { data: recurso, error: recursoError } = await supabase
        .from('recursos_humanos')
        .select('nome_completo, funcao, custo_hora, custo_diaria')
        .eq('id', selectedRecursoId)
        .single();

      if (recursoError) throw recursoError;

      // Fetch apontamentos for the selected resource and period
      let query = supabase
        .from('apontamentos_mo')
        .select('horas_trabalhadas, diaria_trabalhada')
        .eq('recurso_id', selectedRecursoId);

      if (startDate) query = query.gte('data_apontamento', startDate);
      if (endDate) query = query.lte('data_apontamento', endDate);

      const { data: apontamentos, error: apontamentosError } = await query;

      if (apontamentosError) throw apontamentosError;

      let totalHoras = 0;
      let totalDiarias = 0;

      apontamentos.forEach(ap => {
        totalHoras += ap.horas_trabalhadas || 0;
        totalDiarias += ap.diaria_trabalhada || 0;
      });

      const valorAPagar = (totalHoras * (recurso.custo_hora || 0)) + (totalDiarias * (recurso.custo_diaria || 0));

      setReportData({
        recursoNome: `${recurso.nome_completo} (${recurso.funcao})`,
        totalHoras,
        totalDiarias,
        valorAPagar,
      });

    } catch (err) {
      setError(err.message);
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        Relatório de Pagamento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="recurso_id" className="block text-sm font-medium text-gray-700 mb-1">Recurso</label>
          <select
            id="recurso_id"
            value={selectedRecursoId}
            onChange={(e) => setSelectedRecursoId(e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">Selecione um recurso</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>{r.nome_completo} ({r.funcao})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={generateReport} variant="primary" disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Relatório'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {reportData && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Resultados do Relatório</h3>
          <div className="space-y-2">
            <p className="text-lg"><strong>Recurso:</strong> {reportData.recursoNome}</p>
            <p className="text-lg"><strong>Total de Horas:</strong> {reportData.totalHoras.toFixed(2)}</p>
            <p className="text-lg"><strong>Total de Diárias:</strong> {reportData.totalDiarias.toFixed(2)}</p>
            <p className="text-2xl font-bold text-green-700"><strong>Valor a Pagar:</strong> {formatCurrency(reportData.valorAPagar)}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Link to="/apontamentos">
          <Button variant="secondary">Voltar para Apontamentos</Button>
        </Link>
      </div>
    </div>
  );
};

export default RelatorioPagamentoPage;
