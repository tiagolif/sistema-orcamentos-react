import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Import custom UI components
import Button from '../ui/Button';
import Input from '../ui/Input';
import useOrcamentoStore, { useOrcamentoStoreGet } from '../../store/orcamentoStore';
import ToggleSwitch from '../ui/ToggleSwitch';
import RadioGroup from '../ui/RadioGroup';

const categoriasDeObra = [
  'Calçadas e meio-fio', 'Construção e ampliação de rede de abastecimento de água', 'Creches e escolas - Construção', 'Creches e escolas - Reforma', 'Espaços públicos e praças - Construção', 'Espaços públicos e praças - Reforma', 'Galpões', 'Infraestruturas Esportivas - Construção', 'Infraestruturas Esportivas - Reforma', 'Hospitais e unidades de saúde - Construção', 'Hospitais e unidades de saúde - Reforma', 'Muros', 'Passagens molhadas e pontes - Construção', 'Passagens molhadas e pontes - Reforma', 'Pavimentação asfáltica', 'Pavimentação e drenagem', 'Pavimentação em bloco de concreto intertravado', 'Pavimentação em paralelepípedo', 'Prédios públicos - Construção', 'Prédios públicos - Reforma', 'Unidades habitacionais - Construção', 'Unidades habitacionais - Reforma', 'Usinas fotovoltaicas', 'Outros'
];

const OrcamentoWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for editing
  const [step, setStep] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [isLicitacao, setIsLicitacao] = useState(false);

  useEffect(() => {
    console.log('[VIDA] Componente Wizard MONTADO');
    return () => console.log('[VIDA] Componente Wizard DESMONTADO');
  }, []);

  useEffect(() => {
    console.log(`[PASSO] O passo mudou para: ${step}`);
  }, [step]);

  const [formData, setFormData] = useState({
    // Step 1
    codigo: '',
    descricao: '',
    cliente_id: '',
    categoria: categoriasDeObra[0],
    prazo_entrega: '',
    tipo_licitacao: '',
    data_abertura: '',
    num_processo: '',
    // Step 2
    arredondamento: 'arredondar',
    encargos_sociais: 'desonerado',
    bdi_metodo: 'incidir_preco_final',
    bdi_id: '',
    is_bdi_manual: false,
    bdi_lucro: '',
    bdi_despesas_fixas: '',
    bdi_impostos: '',
    itens: [], // Placeholder for budget items
    // Step 3
    bases: {
      sinapi: { enabled: true, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
      sbc: { enabled: false, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
      sicro: { enabled: false, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
    }
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('id, nome_completo, razao_social');
      if (!error) setClientes(data);
    };

    const fetchOrcamento = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('orcamentos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching orcamento:', error);
          navigate('/orcamentos'); // Redirect if orcamento not found
        } else {
          // Map fetched data to formData state
          setFormData({
            codigo: data.codigo || '',
            descricao: data.descricao || '',
            cliente_id: data.cliente_id || '',
            categoria: data.categoria || categoriasDeObra[0],
            prazo_entrega: data.prazo_entrega || '',
            tipo_licitacao: data.tipo_licitacao || '',
            data_abertura: data.data_abertura || '',
            num_processo: data.num_processo || '',
            arredondamento: data.arredondamento || 'arredondar',
            encargos_sociais: data.encargos_sociais || 'desonerado',
            bdi_metodo: data.bdi_metodo || 'incidir_preco_final',
            bdi_id: data.bdi_rate || '', // Corrected from bdi_rate to bdi_id
            is_bdi_manual: data.is_bdi_manual || false,
            bdi_lucro: data.bdi_lucro || '',
            bdi_despesas_fixas: data.bdi_despesas_fixas || '',
            bdi_impostos: data.bdi_impostos || '',
            bases: data.bases || {
              sinapi: { enabled: true, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
              sbc: { enabled: false, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
              sicro: { enabled: false, local: 'SC', versao: '09/2025', arredondamento: 'orcamento' },
            },
          });
          setIsLicitacao(!!(data.tipo_licitacao || data.num_processo));
        }
      }
    };

    if (step === 1) fetchClientes();
    fetchOrcamento();
  }, [id, step, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleBaseChange = useCallback((base, field, value) => {
    setFormData(prev => ({
      ...prev,
      bases: {
        ...prev.bases,
        [base]: { ...prev.bases[base], [field]: value === 'true' ? true : value === 'false' ? false : value }
      }
    }));
  }, []);

          const salvarOrcamentoEItens = useOrcamentoStore(state => state.salvarOrcamentoEItens);

          const handleSubmit = useCallback(async () => {
            if (!formData.cliente_id) {
              alert('Por favor, selecione um cliente no Passo 1.');
              setStep(1);
              return;
            }

            const payloadParaSupabase = {
              codigo: formData.codigo || null,
              descricao: formData.descricao,
              cliente_id: formData.cliente_id,
              categoria: formData.categoria,
              prazo_entrega: formData.prazo_entrega || null,
              tipo_licitacao: formData.tipo_licitacao || null,
              data_abertura: formData.data_abertura || null,
              num_processo: formData.num_processo || null,
              arredondamento: formData.arredondamento,
              encargos_sociais: formData.encargos_sociais,
              bdi_metodo: formData.bdi_metodo,
              bdi_rate: formData.bdi_id ? parseFloat(formData.bdi_id) : null,
              is_bdi_manual: formData.is_bdi_manual,
              bdi_lucro: formData.bdi_lucro || null,
              bdi_despesas_fixas: formData.bdi_despesas_fixas || null,
              bdi_impostos: formData.bdi_impostos || null
            };

            try {
              const { data: novoOrcamento, error: orcamentoError } = id
                ? await supabase.from('orcamentos').update(payloadParaSupabase).eq('id', id).select('id').single()
                : await supabase.from('orcamentos').insert(payloadParaSupabase).select('id').single();

              if (orcamentoError) {
                console.error(orcamentoError.message);
                alert(orcamentoError.message);
                return;
              }

              console.log("DEBUG: ID do Orçamento a salvar:", novoOrcamento.id);
              // A mágica acontece aqui: chama a nova função da store com o ID correto
              await salvarOrcamentoEItens(novoOrcamento.id);

              const orcamentoId = novoOrcamento.id;
              navigate(`/orcamento/${orcamentoId}`);

            } catch (error) {
              console.error(error.message);
              alert(error.message);
            }
          }, [formData, id, navigate, setStep, salvarOrcamentoEItens]);

  const StepIndicator = () => (
    <div className="flex items-center justify-around mb-8 pb-4 border-b border-gray-200 relative"> {/* step-indicator */}
      {/* Connecting lines */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 mx-12"></div>
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-primary mx-12 transition-all duration-300 ease-in-out`}
           style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

      {[1, 2, 3].map((stepNum) => (
        <div
          key={stepNum}
          className={`flex flex-col items-center z-10 ${stepNum <= step ? 'cursor-pointer' : ''}`}
          onClick={() => stepNum <= step && setStep(stepNum)}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300 ease-in-out
              ${stepNum === step
                ? 'bg-emerald-primary border-4 border-emerald-300 text-white shadow-md' // Current step
                : stepNum < step
                  ? 'bg-emerald-primary border-2 border-emerald-primary text-white' // Completed step
                  : 'bg-gray-200 border-2 border-gray-400 text-gray-400' // Pending step
              }`}
          >
            {stepNum < step ? <span className="text-white">&#10003;</span> : <span>{stepNum}</span>}
          </div>
          <span
            className={`text-sm font-semibold transition-colors duration-300 ease-in-out
              ${stepNum === step
                ? 'text-emerald-primary' // Current step
                : stepNum < step
                  ? 'text-emerald-primary' // Completed step
                  : 'text-gray-400' // Pending step
              }`}
          >
            {stepNum === 1 && "Informações Gerais"}
            {stepNum === 2 && "Encargos e BDI"}
            {stepNum === 3 && "Bases"}
          </span>
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="bg-white p-8 rounded-lg shadow-md"> {/* step-card */} 
      <h2 className="mt-0 mb-6">Passo 1: Informações Gerais</h2>
      <div className="grid grid-cols-2 gap-4"> {/* form-grid */}
        <div className="flex flex-col gap-1 col-span-1">
          <label className="text-sm font-medium mb-1">Código</label>
          <Input type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full" placeholder="Ex: ORC001" />
        </div>
        <div className="flex flex-col gap-1 col-span-1">
          <label className="text-sm font-medium mb-1">Descrição do Orçamento</label>
          <Input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="w-full" placeholder="Ex: Construção de muro residencial" />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm font-medium mb-1">Cliente</label>
          <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20 w-full">
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.razao_social || c.nome_completo}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-1">
          <label className="text-sm font-medium mb-1">Categoria</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20 w-full">
            {categoriasDeObra.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-1">
          <label className="text-sm font-medium mb-1">Prazo de entrega do orçamento</label>
          <Input type="date" name="prazo_entrega" value={formData.prazo_entrega} onChange={handleChange} className="w-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-md mb-6"> {/* licitacao-checkbox */}
        <ToggleSwitch
          id="licitacao"
          label="Este orçamento é para uma LICITAÇÃO?"
          checked={isLicitacao}
          onChange={(e) => setIsLicitacao(e.target.checked)}
        />
      </div>
      {isLicitacao && (
        <div className="mb-6">
          <p className="font-semibold text-lg text-gray-700 mb-4 border-b border-gray-200 pb-1.5">Dados da Licitação</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-1">
              <label className="text-sm font-medium mb-1">Tipo de Licitação</label>
              <Input type="text" name="tipo_licitacao" value={formData.tipo_licitacao} onChange={handleChange} className="w-full" placeholder="Ex: Concorrência Pública" />
            </div>
            <div className="flex flex-col gap-1 col-span-1">
              <label className="text-sm font-medium mb-1">Data e Hora de Abertura</label>
              <Input type="datetime-local" name="data_abertura" value={formData.data_abertura} onChange={handleChange} className="w-full" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm font-medium mb-1">Número do Processo</label>
              <Input type="text" name="num_processo" value={formData.num_processo} onChange={handleChange} className="w-full" placeholder="Ex: 001/2025" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
  const Step2 = () => {
    const [bdiSource, setBdiSource] = useState(formData.is_bdi_manual ? 'manual' : 'existing');

    const handleBdiSourceChange = (e) => {
      const newBdiSource = e.target.value;
      setBdiSource(newBdiSource);
      setFormData(prev => ({ ...prev, is_bdi_manual: newBdiSource === 'manual' }));
    };

    return (
      <div className="bg-white p-8 rounded-lg shadow-md"> {/* step-card */}
        <h2 className="mt-0 mb-6">Passo 2: Arredondamento, Encargos e BDI</h2>
        <div className="grid grid-cols-1 gap-6"> {/* form-body-grid */}
          {/* Arredondamento do Orçamento */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"> {/* card */}
            <RadioGroup
              label="Arredondamento do Orçamento"
              name="arredondamento"
              options={[
                { label: 'Truncar em 2 casas decimais', value: 'truncar' },
                { label: 'Arredondar em 2 casas decimais', value: 'arredondar' },
                { label: 'Não arredondar', value: 'nao_arredondar' },
              ]}
              selectedValue={formData.arredondamento}
              onChange={handleChange}
            />
          </div>

          {/* Encargos Sociais */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"> {/* card */}
            <RadioGroup
              label="Encargos Sociais"
              name="encargos_sociais"
              options={[
                { label: 'Desonerado', value: 'desonerado' },
                { label: 'Não desonerado', value: 'nao_desonerado' },
              ]}
              selectedValue={formData.encargos_sociais}
              onChange={handleChange}
            />
          </div>

          {/* BDI - Benefícios e Despesas Indiretas */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"> {/* card */}
            <p className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-200 pb-1.5">BDI - Benefícios e Despesas Indiretas</p>

            {/* Método de Aplicação */}
            <div className="mb-6">
              <p className="font-semibold text-lg text-gray-700 mb-3">Método de Aplicação</p>
              <RadioGroup
                name="bdi_metodo"
                options={[
                  { label: 'Incidir sobre o preço final do orçamento', value: 'incidir_preco_final' },
                  { label: 'Incidir sobre o preço unitário da composição', value: 'incidir_preco_unitario' },
                ]}
                selectedValue={formData.bdi_metodo}
                onChange={handleChange}
              />
            </div>

            {/* Origem do BDI */}
            <div className="mb-6">
              <p className="font-semibold text-lg text-gray-700 mb-3">Origem do BDI</p>
              <RadioGroup
                name="bdiSource"
                options={[
                  { label: 'Selecionar BDI existente', value: 'existing' },
                  { label: 'Informar BDI manualmente', value: 'manual' },
                ]}
                selectedValue={bdiSource}
                onChange={handleBdiSourceChange}
              />
            </div>

            {bdiSource === 'existing' && (
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-sm font-medium mb-1">Selecione um BDI existente</label>
                <select name="bdi_id" value={formData.bdi_id} onChange={handleChange} className="w-full py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20">
                  <option value="0">Nenhum (0.0%)</option>
                  <option value="25.0">BDI Obra Privada (Mercado) - 25.0%</option>
                  <option value="22.5">BDI Licitação Federal - Edificação (TCU) - 22.5%</option>
                  <option value="24.5">BDI Licitação Federal - Infraestrutura (TCU) - 24.5%</option>
                  <option value="22.3">BDI Licitação Federal - Rodoviária (TCU) - 22.3%</option>
                </select>
              </div>
            )}

            {bdiSource === 'manual' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium mb-1">Lucro (%)</label>
                  <Input type="number" name="bdi_lucro" value={formData.bdi_lucro || ''} onChange={handleChange} className="w-full" placeholder="Ex: 10" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium mb-1">Despesas Fixas (%)</label>
                  <Input type="number" name="bdi_despesas_fixas" value={formData.bdi_despesas_fixas || ''} onChange={handleChange} className="w-full" placeholder="Ex: 15" />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-sm font-medium mb-1">Impostos (%)</label>
                  <Input type="number" name="bdi_impostos" value={formData.bdi_impostos || ''} onChange={handleChange} className="w-full" placeholder="Ex: 5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Step3 = () => (
    <div className="bg-white p-8 rounded-lg shadow-md"> {/* step-card */}
      <h2 className="mt-0 mb-6">Passo 3: Bases de Custo</h2>
      <div className="flex flex-col gap-4"> {/* bases-list */}
        {Object.keys(formData.bases).map(baseKey => {
          const base = formData.bases[baseKey];
          return (
            <div key={baseKey} className={`bg-white p-4 rounded-lg shadow-sm border ${base.enabled ? 'border-emerald-primary' : 'border-gray-200 opacity-50'}`}>
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center gap-3 font-medium cursor-pointer" onClick={() => handleBaseChange(baseKey, 'enabled', !base.enabled)}> {/* base-name */}
                  <Input type="checkbox" checked={base.enabled} onChange={(e) => handleBaseChange(baseKey, 'enabled', e.target.checked)} className="w-4 h-4" />
                  <label>{baseKey.toUpperCase()}</label>
                </div>
                <select value={base.local} onChange={(e) => handleBaseChange(baseKey, 'local', e.target.value)} disabled={!base.enabled} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20"><option>Santa Catarina</option></select>
                <select value={base.versao} onChange={(e) => handleBaseChange(baseKey, 'versao', e.target.value)} disabled={!base.enabled} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20"><option>09/2025</option></select>
                <select value={base.arredondamento} onChange={(e) => handleBaseChange(baseKey, 'arredondamento', e.target.value)} disabled={!base.enabled} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-emerald-primary focus:ring-3 focus:ring-emerald-primary/20"><option value="orcamento">Seguir configuração do orçamento</option><option value="item">Arredondar por item</option></select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


  return (
    <div className="max-w-3xl mx-auto my-8"> {/* wizard-container */}
      <StepIndicator />
      
      {/* {submissionError && <p className="text-red-500 font-bold text-lg p-4 bg-red-100 rounded-md">Erro na Submissão: {submissionError}</p>} */}

      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200"> {/* wizard-actions */}
        {step > 1 && <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>Voltar</Button>}
        {step < 3 ? <Button type="button" variant="primary" onClick={() => setStep(step + 1)}>Próximo</Button> : <Button type="button" variant="primary" onClick={handleSubmit}>Finalizar e Salvar</Button>}
      </div>
    </div>
  );
};

export default OrcamentoWizard;