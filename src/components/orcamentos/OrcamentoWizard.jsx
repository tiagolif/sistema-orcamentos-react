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
  const [obras, setObras] = useState([]);

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
    obra_id: '',
    modalidade: 'SINAPI', // SINAPI vs CONTRATO
    contrato_base_id: '',
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
    const fetchObras = async () => {
      if (formData.cliente_id) {
        const { data, error } = await supabase
          .from('obras')
          .select('id, nome_obra')
          .eq('cliente_id', formData.cliente_id);
        if (!error) {
          setObras(data);
        }
      } else {
        setObras([]);
      }
    };
    fetchObras();
  }, [formData.cliente_id]);

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
            obra_id: data.obra_id || '',
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
    
    if (name === 'modalidade') {
      const newState = { ...formData, modalidade: value };
      if (value === 'SANEAMENTO') {
        newState.bdi_id = 0;
        newState.is_bdi_manual = false;
        newState.bdi_lucro = '';
        newState.bdi_despesas_fixas = '';
        newState.bdi_impostos = '';
        newState.bases = {
          sinapi: { enabled: false },
          sbc: { enabled: false },
          sicro: { enabled: false },
        };
      }
      setFormData(newState);
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  }, [formData]);

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
              obra_id: formData.obra_id,
              categoria: formData.categoria,
              modalidade: formData.modalidade,
              contrato_base_id: formData.contrato_base_id || null,
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

  const [contratos, setContratos] = useState([]);

  useEffect(() => {
    const fetchContratos = async () => {
      const { data, error } = await supabase.from('contratos_config').select('id, nome_contrato');
      if (!error) setContratos(data);
    };
    if (formData.modalidade === 'CONTRATO') {
      fetchContratos();
    }
  }, [formData.modalidade]);

// ... (previous code)

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const StepIndicator = () => {
    if (formData.modalidade === 'SANEAMENTO') {
      return (
        <div className="flex items-center justify-around mb-8 pb-4 border-b border-gray-200 relative">
            <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold bg-emerald-primary border-4 border-emerald-300 text-white shadow-md">
                    <span>1</span>
                </div>
                <span className="text-sm font-semibold text-emerald-primary">Informações Gerais</span>
            </div>
        </div>
      );
    }

    // Default for SINAPI
    return (
      <div className="flex items-center justify-around mb-8 pb-4 border-b border-gray-200 relative">
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
                ${stepNum === step ? 'bg-emerald-primary border-4 border-emerald-300 text-white shadow-md' : stepNum < step ? 'bg-emerald-primary border-2 border-emerald-primary text-white' : 'bg-gray-200 border-2 border-gray-400 text-gray-400'}`}
            >
              {stepNum < step ? <span className="text-white">&#10003;</span> : <span>{stepNum}</span>}
            </div>
            <span className={`text-sm font-semibold transition-colors duration-300 ease-in-out ${stepNum === step ? 'text-emerald-primary' : 'text-gray-400'}`}>
              {stepNum === 1 && "Informações Gerais"}
              {stepNum === 2 && "Encargos e BDI"}
              {stepNum === 3 && "Bases de Custo"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const Step1 = () => (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="mt-0 mb-6">Passo 1: Informações Gerais</h2>
      <div className="mb-6">
        <RadioGroup
          label="Modalidade do Orçamento"
          name="modalidade"
          options={[
            { label: 'SINAPI (Obra Civil / Composição de Preço)', value: 'SINAPI' },
            { label: 'SANEAMENTO (Preço Fixo Contratual)', value: 'SANEAMENTO' },
          ]}
          selectedValue={formData.modalidade}
          onChange={handleChange}
        />
        {formData.modalidade === 'SANEAMENTO' && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="font-bold">Atenção:</p>
                <p>Nesta modalidade, os preços são baseados no Contrato/Catálogo Interno. As etapas de BDI e Bases SINAPI serão puladas.</p>
            </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
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
          <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.razao_social || c.nome_completo}</option>)}
          </select>
        </div>
        {/* ... other fields from Step 1 ... */}
      </div>
    </div>
  );
  
  const Step2 = () => {
    if (formData.modalidade === 'SANEAMENTO') {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="mt-0 mb-6">Passo 2: Encargos e BDI</h2>
          <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <p className="font-bold">Nesta modalidade, os preços são fixos contratuais. O BDI não se aplica e foi definido como 0%.</p>
          </div>
        </div>
      );
    }

    // ... (rest of Step2 component for SINAPI)
  };

  const Step3 = () => {
    if (formData.modalidade === 'SANEAMENTO') {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="mt-0 mb-6">Passo Final: Base de Contrato</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium mb-1">Selecione a Tabela de Preços do Contrato</label>
            <select name="contrato_base_id" value={formData.contrato_base_id} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="" disabled>Selecione um contrato</option>
              {contratos.map(c => <option key={c.id} value={c.id}>{c.nome_contrato}</option>)}
            </select>
          </div>
        </div>
      );
    }

    // Default Step 3 for SINAPI
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="mt-0 mb-6">Passo 3: Bases de Custo</h2>
        {/* ... (rest of Step3 component for SINAPI) */}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto my-8">
      <StepIndicator />
      
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
        {step > 1 && <Button type="button" variant="secondary" onClick={handleBack}>Voltar</Button>}
        {step < 3 ? <Button type="button" variant="primary" onClick={handleNext}>Próximo</Button> : <Button type="button" variant="primary" onClick={handleSubmit}>Finalizar e Salvar</Button>}
      </div>
    </div>
  );
};

export default OrcamentoWizard;