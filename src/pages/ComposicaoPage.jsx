import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import InsumoSearchModal from '../components/modal/InsumoSearchModal';

import { FaQuestion } from 'react-icons/fa';
import HelpModal from '../components/ui/HelpModal';

const ComposicaoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [composicao, setComposicao] = useState({ codigo: '', descricao: '', unidade: '', base_id: '' });
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [basesDePreco, setBasesDePreco] = useState([]);

  // Efeito para buscar as bases de preço
  useEffect(() => {
    const fetchBases = async () => {
      const { data, error } = await supabase.from('bases_de_preco').select('id, nome');
      if (!error) setBasesDePreco(data);
    };
    fetchBases();
  }, []);

  // Efeito para buscar os dados da composição e seus itens se for modo de edição
  useEffect(() => {
    if (id) {
      const fetchComposicao = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('composicoes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar composição:', error);
          navigate('/composicoes');
        } else {
          setComposicao(data);
          // Aqui também buscaremos os itens da composição
          const { data: itensData, error: itensError } = await supabase
            .from('composicao_itens')
            .select('*, insumos(*)') // Expandir os dados do insumo
            .eq('composicao_id', id);
          
          if (itensError) {
            console.error('Erro ao buscar itens da composição:', itensError);
          } else {
            setItens(itensData);
          }
        }
        setLoading(false);
      };
      fetchComposicao();
    }
  }, [id, navigate]);

  const handleComposicaoChange = (e) => {
    const { name, value } = e.target;
    setComposicao(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectInsumo = (insumo) => {
    const coeficiente = prompt('Digite o coeficiente (quantidade) para este insumo:', 1);
    if (coeficiente && !isNaN(parseFloat(coeficiente))) {
      const novoItem = {
        insumo_id: insumo.id,
        coeficiente: parseFloat(coeficiente),
        // Adicionamos os dados do insumo diretamente para facilitar a exibição
        insumos: insumo 
      };
      setItens(prevItens => [...prevItens, novoItem]);
    }
  };

  const handleCoeficienteChange = (index, novoCoeficiente) => {
    const novosItens = [...itens];
    novosItens[index].coeficiente = parseFloat(novoCoeficiente) || 0;
    setItens(novosItens);
  };

  const handleRemoveItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const calcularTotais = () => {
    const totalMaterial = itens.reduce((acc, item) => {
      if (item.insumos.tipo_insumo !== 'MO') {
        return acc + (item.coeficiente * (item.insumos.custo_unitario || 0));
      }
      return acc;
    }, 0);
    const totalMaoDeObra = itens.reduce((acc, item) => {
      if (item.insumos.tipo_insumo === 'MO') {
        return acc + (item.coeficiente * (item.insumos.custo_unitario || 0));
      }
      return acc;
    }, 0);
    const custoTotal = totalMaterial + totalMaoDeObra;
    return { totalMaterial, totalMaoDeObra, custoTotal };
  };

  const totais = calcularTotais();

  const handleSave = async () => {
    setLoading(true);

    const { totalMaterial, totalMaoDeObra, custoTotal } = calcularTotais();

    // 1. Prepara o objeto da composição para salvar
    const composicaoData = {
      id: id || undefined,
      codigo: composicao.codigo,
      descricao: composicao.descricao,
      unidade: composicao.unidade,
      base_id: composicao.base_id,
      custo_total_material: totalMaterial,
      custo_total_mao_obra: totalMaoDeObra,
      custo_total: custoTotal,
      // Assumindo valores padrão para campos não preenchidos no form
      estado: 'SC', // Exemplo
      desonerado: true // Exemplo
    };

    // 2. Faz o "upsert" da composição. Se o ID existir, atualiza. Se não, insere.
    const { data: savedComposicao, error: composicaoError } = await supabase
      .from('composicoes')
      .upsert(composicaoData)
      .select()
      .single();

    if (composicaoError) {
      console.error('Erro ao salvar composição:', composicaoError);
      alert(`Erro ao salvar a composição: ${composicaoError.message}`);
      setLoading(false);
      return;
    }

    const composicaoId = savedComposicao.id;

    // 3. Deleta os itens antigos para evitar duplicatas e inconsistências
    if (id) { // Só deleta se estiver editando uma composição existente
        const { error: deleteError } = await supabase
            .from('composicao_itens')
            .delete()
            .eq('composicao_id', composicaoId);

        if (deleteError) {
            console.error('Erro ao limpar itens antigos:', deleteError);
            alert('Erro ao atualizar os itens da composição. Tente novamente.');
            setLoading(false);
            return;
        }
    }

    // 4. Prepara e insere os novos itens da composição
    const itensParaSalvar = itens.map(item => {
        const precoUnitario = (item.insumos.preco_material || 0) + (item.insumos.preco_mao_obra || 0);
        return {
            composicao_id: composicaoId,
            codigo_insumo: item.insumos.codigo_item,
            tipo_item: 'INSUMO', // Assumindo que só adicionamos insumos por enquanto
            coeficiente: item.coeficiente,
            preco_unitario: precoUnitario,
            custo_total: item.coeficiente * precoUnitario
        };
    });

    if (itensParaSalvar.length > 0) {
        const { error: itensError } = await supabase
            .from('composicao_itens')
            .insert(itensParaSalvar);

        if (itensError) {
            console.error('Erro ao salvar itens da composição:', itensError);
            alert(`Erro ao salvar os itens: ${itensError.message}`);
            setLoading(false);
            return;
        }
    }

    setLoading(false);
    alert('Composição salva com sucesso!');
    navigate('/composicoes');
  };

  if (loading && id) {
    return <div className="p-6">Carregando composição...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{id ? 'Editar Composição' : 'Nova Composição'}</h1>
        <Button onClick={() => navigate('/composicoes')} variant="secondary">Voltar</Button>
      </div>

      {/* Formulário de Dados Gerais */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Dados Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="codigo" label="Código" value={composicao.codigo} onChange={handleComposicaoChange} placeholder="Ex: 001.A" />
          <Input name="descricao" label="Descrição" value={composicao.descricao} onChange={handleComposicaoChange} placeholder="Ex: Instalação de porta de madeira" className="md:col-span-2" />
          <Input name="unidade" label="Unidade" value={composicao.unidade} onChange={handleComposicaoChange} placeholder="Ex: UN, M², M³" />
          <div className="flex flex-col">
            <label htmlFor="base_id" className="mb-1 text-sm font-medium">Base de Preço</label>
            <select id="base_id" name="base_id" value={composicao.base_id} onChange={handleComposicaoChange} className="p-2 border rounded">
              <option value="" disabled>Selecione uma base</option>
              {basesDePreco.map(base => (
                <option key={base.id} value={base.id}>{base.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Totais da Composição */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Custos da Composição</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-500">Custo Material</p>
            <p className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalMaterial)}</p>
          </div>
          <div>
            <p className="text-gray-500">Custo Mão de Obra</p>
            <p className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.totalMaoDeObra)}</p>
          </div>
          <div>
            <p className="text-gray-500">Custo Total</p>
            <p className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.custoTotal)}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Itens da Composição */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Itens da Composição</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Adicionar Insumo</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">Insumo</th>
              <th className="py-2 px-4 text-left">Unidade</th>
              <th className="py-2 px-4 text-right">Coeficiente</th>
              <th className="py-2 px-4 text-right">Preço Unitário</th>
              <th className="py-2 px-4 text-right">Custo Total</th>
              <th className="py-2 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => {
              const precoUnitario = item.insumos.custo_unitario || 0;
              const custoTotal = item.coeficiente * precoUnitario;
              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.insumos.descricao}</td>
                  <td className="py-2 px-4">{item.insumos.unidade}</td>
                  <td className="py-2 px-4 text-right">
                    <Input 
                      type="number" 
                      value={item.coeficiente} 
                      onChange={(e) => handleCoeficienteChange(index, e.target.value)} 
                      className="w-24 text-right"
                    />
                  </td>
                  <td className="py-2 px-4 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoUnitario)}</td>
                  <td className="py-2 px-4 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoTotal)}</td>
                  <td className="py-2 px-4 text-center">
                    <Button variant="danger" onClick={() => handleRemoveItem(index)}>Remover</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <InsumoSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectInsumo}
      />

      {/* Botão de Ajuda */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={() => setIsHelpModalOpen(true)} 
          className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 animate-pulse"
          title="Ajuda"
        >
          <FaQuestion />
        </Button>
      </div>

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title="Como Usar a Calculadora de Composições">
        <h3>O que é uma Composição de Custo?</h3>
        <p>Uma <strong>Composição de Custo Unitário (CPU)</strong> é o "DNA" de um serviço de engenharia. Ela detalha todos os insumos (materiais, mão de obra e equipamentos) e seus respectivos <strong>coeficientes</strong> necessários para executar <strong>uma unidade</strong> de um determinado serviço.</p>
        <p><strong>Exemplo:</strong> Para executar <strong>1 m²</strong> de alvenaria, você precisa de tijolos, cimento, areia e do tempo de um pedreiro e de um servente.</p>
        
        <h4 className="mt-4">Dados Gerais</h4>
        <ul>
          <li><strong>Código:</strong> Um identificador único para sua composição (ex: ALV.001).</li>
          <li><strong>Descrição:</strong> O nome do serviço (ex: Alvenaria de Vedação com Bloco Cerâmico 8 Furos).</li>
          <li><strong>Unidade:</strong> A unidade de medida do serviço final (m², m³, un, etc.).</li>
          <li><strong>Base de Preço:</strong> A tabela de referência (ex: SINAPI, Base Própria) da qual os preços dos insumos serão, por padrão, herdados.</li>
        </ul>

        <h4 className="mt-4">Itens da Composição (Insumos)</h4>
        <p>Aqui você adiciona os componentes do seu serviço. O campo mais importante é o <strong>coeficiente</strong>.</p>
        <ul>
            <li><strong>Coeficiente:</strong> É a quantidade de um insumo necessária para produzir <strong>uma unidade</strong> da sua composição. Por exemplo, se para fazer 1 m² de parede você gasta 0,15 horas de um pedreiro, o coeficiente do insumo "Pedreiro" será <strong>0.15</strong>.</li>
        </ul>

        <h4 className="mt-4">Cálculos Técnicos</h4>
        <p>O sistema calcula os custos automaticamente da seguinte forma:</p>
        <ul>
            <li><strong>Custo do Insumo:</strong> <code>Coeficiente * Preço Unitário do Insumo</code></li>
            <li><strong>Custo Total da Composição:</strong> É a <strong>soma</strong> do Custo de todos os insumos adicionados.</li>
            <li>O sistema também separa os custos totais em <strong>Material</strong> e <strong>Mão de Obra</strong> para análises mais detalhadas.</li>
        </ul>
      </HelpModal>

      {/* Ações */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={handleSave} variant="primary">Salvar Composição</Button>
      </div>
    </div>
  );
};

export default ComposicaoPage;
