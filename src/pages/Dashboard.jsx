import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalAPagar: 0,
    totalAReceber: 0,
    totalPagoMes: 0,
    totalRecebidoMes: 0,
  });
  const [obrasEmAndamento, setObrasEmAndamento] = useState([]);
  const [orcamentosEmElaboracao, setOrcamentosEmElaboracao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('DEBUG: Iniciando fetchDashboardData...');
      setLoading(true);
      setError(null);

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

      try {
        // Fetch Financial KPIs
        const { data: lancamentos, error: lancamentosError } = await supabase
          .from('lancamentos_financeiros')
          .select('*');
        console.log('DEBUG: Lancamentos fetched:', lancamentos, 'Error:', lancamentosError);

        if (lancamentosError) throw lancamentosError;

        let totalAPagar = 0;
        let totalAReceber = 0;
        let totalPagoMes = 0;
        let totalRecebidoMes = 0;

        lancamentos.forEach(l => {
          if (l.tipo === 'DESPESA' && l.status === 'A PAGAR') {
            totalAPagar += l.valor;
          }
          if (l.tipo === 'RECEITA' && l.status === 'A RECEBER') {
            totalAReceber += l.valor;
          }
          // Check if data_pagamento exists before comparing dates
          if (l.tipo === 'DESPESA' && l.status === 'PAGO' && l.data_pagamento && new Date(l.data_pagamento) >= new Date(startOfMonth) && new Date(l.data_pagamento) <= new Date(endOfMonth)) {
            totalPagoMes += l.valor;
          }
          if (l.tipo === 'RECEITA' && l.status === 'RECEBIDO' && l.data_pagamento && new Date(l.data_pagamento) >= new Date(startOfMonth) && new Date(l.data_pagamento) <= new Date(endOfMonth)) {
            totalRecebidoMes += l.valor;
          }
        });

        setKpis({ totalAPagar, totalAReceber, totalPagoMes, totalRecebidoMes });
        console.log('DEBUG: KPIs calculados:', { totalAPagar, totalAReceber, totalPagoMes, totalRecebidoMes });

        // Fetch Obras em Andamento
        const { data: obras, error: obrasError } = await supabase
          .from('obras')
          .select('id, nome_obra, status_obra')
          .in('status_obra', ['Em Planejamento', 'Em Execução']);
        console.log('DEBUG: Obras fetched:', obras, 'Error:', obrasError);

        if (obrasError) throw obrasError;
        setObrasEmAndamento(obras);

        // Fetch Orçamentos em Elaboração
        const { data: orcamentos, error: orcamentosError } = await supabase
          .from('orcamentos')
          .select(`
            id, descricao, status,
            clientes!cliente_id(nome_completo, razao_social)
          `)
          .eq('status', 'Em elaboração');
        console.log('DEBUG: Orcamentos fetched:', orcamentos, 'Error:', orcamentosError);

        if (orcamentosError) throw orcamentosError;
        setOrcamentosEmElaboracao(orcamentos);

      } catch (err) {
        setError(err.message);
        console.error('DEBUG: Error caught in fetchDashboardData:', err);
      } finally {
        setLoading(false);
        console.log('DEBUG: fetchDashboardData finalizado. Loading:', false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erro ao carregar dashboard: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total a Pagar" value={formatCurrency(kpis.totalAPagar)} color="red" />
        <KPICard title="Total a Receber" value={formatCurrency(kpis.totalAReceber)} color="green" />
        <KPICard title="Pago este Mês" value={formatCurrency(kpis.totalPagoMes)} color="blue" />
        <KPICard title="Recebido este Mês" value={formatCurrency(kpis.totalRecebidoMes)} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Obras em Andamento */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Obras em Andamento</h2>
          {obrasEmAndamento.length > 0 ? (
            <ul className="space-y-2">
              {obrasEmAndamento.map(obra => (
                <li key={obra.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <Link to={`/cadastros/obras/visualizar/${obra.id}`} className="text-accent hover:underline">
                    {obra.nome_obra}
                  </Link>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    obra.status_obra === 'Em Execução' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {obra.status_obra}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma obra em andamento.</p>
          )}
        </div>

        {/* Orçamentos em Elaboração */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Orçamentos em Elaboração</h2>
          {orcamentosEmElaboracao.length > 0 ? (
            <ul className="space-y-2">
              {orcamentosEmElaboracao.map(orcamento => (
                <li key={orcamento.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <Link to={`/orcamento/${orcamento.id}`} className="text-accent hover:underline">
                    {orcamento.descricao}
                  </Link>
                  <span className="text-gray-600 text-sm">
                    {orcamento.clientes ? (orcamento.clientes.razao_social || orcamento.clientes.nome_completo) : 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum orçamento em elaboração.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, color }) => {
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className={`${colorClasses[color]} text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;