import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FluxoCaixaPage = () => {
  const [totais, setTotais] = useState({
    totalAPagar: 0,
    totalPago: 0,
    totalAReceber: 0,
    totalRecebido: 0,
  });

  useEffect(() => {
    const fetchLancamentos = async () => {
      const { data, error } = await supabase
        .from('lancamentos_financeiros')
        .select('valor, tipo, status');

      if (error) {
        console.error('Error fetching lancamentos:', error);
        return;
      }

      const newTotais = data.reduce(
        (acc, lancamento) => {
          if (lancamento.tipo === 'DESPESA') {
            if (lancamento.status === 'A PAGAR') {
              acc.totalAPagar += lancamento.valor;
            } else if (lancamento.status === 'PAGO') {
              acc.totalPago += lancamento.valor;
            }
          } else if (lancamento.tipo === 'RECEITA') {
            if (lancamento.status === 'A RECEBER') {
              acc.totalAReceber += lancamento.valor;
            } else if (lancamento.status === 'RECEBIDO') {
              acc.totalRecebido += lancamento.valor;
            }
          }
          return acc;
        },
        { totalAPagar: 0, totalPago: 0, totalAReceber: 0, totalRecebido: 0 }
      );
      setTotais(newTotais);
    };

    fetchLancamentos();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const chartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        label: 'Total',
        data: [
          totais.totalAReceber + totais.totalRecebido,
          totais.totalAPagar + totais.totalPago,
        ],
        backgroundColor: ['#4CAF50', '#F44336'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fluxo de Caixa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Total a Pagar</h2>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totais.totalAPagar)}</p>
        </div>
        <div className="bg-red-200 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Pago</h2>
          <p className="text-2xl font-bold text-red-800">{formatCurrency(totais.totalPago)}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Total a Receber</h2>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totais.totalAReceber)}</p>
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Total Recebido</h2>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(totais.totalRecebido)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Receitas vs. Despesas</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default FluxoCaixaPage;
