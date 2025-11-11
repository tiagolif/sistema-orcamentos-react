import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useDebounce } from 'use-debounce';

const BoletimDetalhePage = () => {
  const { id } = useParams();
  const [boletim, setBoletim] = useState(null);
  const [orcamentoItens, setOrcamentoItens] = useState([]);
  const [medicoesAnteriores, setMedicoesAnteriores] = useState({});
  const [medicoesAtuais, setMedicoesAtuais] = useState({});
  const [debouncedMedicoes] = useDebounce(medicoesAtuais, 1000);

  useEffect(() => {
    const fetchBoletim = async () => {
      const { data } = await supabase
        .from('medicoes_boletins')
        .select('*, obras(*)')
        .eq('id', id)
        .single();
      setBoletim(data);
    };

    if (id) {
      fetchBoletim();
    }
  }, [id]);

  useEffect(() => {
    const fetchOrcamentoItens = async () => {
      if (!boletim) return;
      const { data: orcamento } = await supabase
        .from('orcamentos')
        .select('id')
        .eq('obra_id', boletim.obra_id)
        .single();

      if (orcamento) {
        const { data: itens } = await supabase
          .from('orcamento_itens')
          .select('*')
          .eq('orcamento_id', orcamento.id);
        setOrcamentoItens(itens);
      }
    };

    const fetchMedicoesAnteriores = async () => {
        if (!boletim) return;
        const { data: boletinsAnteriores } = await supabase
            .from('medicoes_boletins')
            .select('id')
            .eq('obra_id', boletim.obra_id)
            .lt('mes_referencia', boletim.mes_referencia);

        if (boletinsAnteriores && boletinsAnteriores.length > 0) {
            const boletimIds = boletinsAnteriores.map(b => b.id);
            const { data: medicoes } = await supabase
                .from('medicoes_itens')
                .select('orcamento_item_id, quantidade_medida')
                .in('boletim_id', boletimIds);
            
            const medicoesAgrupadas = medicoes.reduce((acc, medicao) => {
                acc[medicao.orcamento_item_id] = (acc[medicao.orcamento_item_id] || 0) + medicao.quantidade_medida;
                return acc;
            }, {});
            setMedicoesAnteriores(medicoesAgrupadas);
        }
    };

    const fetchMedicoesAtuais = async () => {
        if (!boletim) return;
        const { data } = await supabase
            .from('medicoes_itens')
            .select('orcamento_item_id, quantidade_medida')
            .eq('boletim_id', id);
        
        const medicoes = data.reduce((acc, medicao) => {
            acc[medicao.orcamento_item_id] = medicao.quantidade_medida;
            return acc;
        }, {});
        setMedicoesAtuais(medicoes);
    };

    if (boletim) {
      fetchOrcamentoItens();
      fetchMedicoesAnteriores();
      fetchMedicoesAtuais();
    }
  }, [boletim, id]);

  useEffect(() => {
    const saveMedicoes = async () => {
      const upserts = Object.entries(debouncedMedicoes).map(([orcamento_item_id, quantidade_medida]) => ({
        boletim_id: id,
        orcamento_item_id,
        quantidade_medida,
      }));

      if (upserts.length > 0) {
        await supabase.from('medicoes_itens').upsert(upserts, { onConflict: 'boletim_id, orcamento_item_id' });
      }
    };

    saveMedicoes();
  }, [debouncedMedicoes, id]);

  const handleMedicaoChange = (orcamentoItemId, value) => {
    setMedicoesAtuais(prev => ({ ...prev, [orcamentoItemId]: parseFloat(value) || 0 }));
  };

  if (!boletim) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Boletim de Medição</h1>
      <p className="text-lg mb-6">{boletim.obras.nome_obra} - {new Date(boletim.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>

      <div className="flex justify-end mb-4">
        <Button disabled>Sugerir Quantidades via Diário de Obras</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th>Item</th>
              <th>Unidade</th>
              <th>Qtd. Orçada</th>
              <th>Qtd. Medida Anterior</th>
              <th>Qtd. Medida (Este Boletim)</th>
              <th>Saldo a Medir</th>
            </tr>
          </thead>
          <tbody>
            {orcamentoItens.map(item => {
              const qtdAnterior = medicoesAnteriores[item.id] || 0;
              const qtdAtual = medicoesAtuais[item.id] || 0;
              const saldo = item.quantidade - qtdAnterior - qtdAtual;

              return (
                <tr key={item.id}>
                  <td>{item.descricao}</td>
                  <td>{item.unidade}</td>
                  <td>{item.quantidade}</td>
                  <td>{qtdAnterior}</td>
                  <td>
                    <Input
                      type="number"
                      value={qtdAtual}
                      onChange={e => handleMedicaoChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>{saldo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoletimDetalhePage;
