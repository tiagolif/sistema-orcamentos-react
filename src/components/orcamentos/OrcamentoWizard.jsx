import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './OrcamentoWizard.css';
import '../ClientForm.css'; // Reutilizando estilos de formulário

const categoriasDeObra = [
  'Calçadas e meio-fio',
  'Construção e ampliação de rede de abastecimento de água',
  'Creches e escolas - Construção',
  'Creches e escolas - Reforma',
  'Espaços públicos e praças - Construção',
  'Espaços públicos e praças - Reforma',
  'Galpões',
  'Infraestruturas Esportivas - Construção',
  'Infraestruturas Esportivas - Reforma',
  'Hospitais e unidades de saúde - Construção',
  'Hospitais e unidades de saúde - Reforma',
  'Muros',
  'Passagens molhadas e pontes - Construção',
  'Passagens molhadas e pontes - Reforma',
  'Pavimentação asfáltica',
  'Pavimentação e drenagem',
  'Pavimentação em bloco de concreto intertravado',
  'Pavimentação em paralelepípedo',
  'Prédios públicos - Construção',
  'Prédios públicos - Reforma',
  'Unidades habitacionais - Construção',
  'Unidades habitacionais - Reforma',
  'Usinas fotovoltaicas',
  'Outros'
];

const OrcamentoWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [isLicitacao, setIsLicitacao] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    descricao: '',
    cliente_id: '',
    categoria: categoriasDeObra[0], // Define um valor padrão
    prazo_entrega: '',
    tipo_licitacao: '',
    data_abertura: '',
    num_processo: '',
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('id, nome_completo, razao_social');
      if (!error) setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <span>Informações Gerais</span>
      </div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <span>Itens do Orçamento</span>
      </div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <span>Totais e Fechamento</span>
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="step-card">
      <h2>Passo 1: Informações Gerais</h2>
      <div className="form-grid">
        <div className="form-group col-span-4"><label>Código</label><input type="text" name="codigo" value={formData.codigo} onChange={handleChange} /></div>
        <div className="form-group col-span-8"><label>Descrição do Orçamento</label><input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required /></div>
        <div className="form-group col-span-12"><label>Cliente</label><select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required><option value="" disabled>Selecione um cliente</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.razao_social || c.nome_completo}</option>)}</select></div>
        <div className="form-group col-span-6">
          <label>Categoria</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange}>
            {categoriasDeObra.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="form-group col-span-6"><label>Prazo de entrega do orçamento</label><input type="date" name="prazo_entrega" value={formData.prazo_entrega} onChange={handleChange} /></div>
      </div>

      <div className="licitacao-checkbox">
        <input type="checkbox" id="licitacao" checked={isLicitacao} onChange={(e) => setIsLicitacao(e.target.checked)} />
        <label htmlFor="licitacao">Este orçamento é para uma LICITAÇÃO?</label>
      </div>

      {isLicitacao && (
        <div className="form-section">
          <p className="form-section-title">Dados da Licitação</p>
          <div className="form-grid">
            <div className="form-group col-span-6"><label>Tipo de Licitação</label><input type="text" name="tipo_licitacao" value={formData.tipo_licitacao} onChange={handleChange} /></div>
            <div className="form-group col-span-6"><label>Data e Hora de Abertura</label><input type="datetime-local" name="data_abertura" value={formData.data_abertura} onChange={handleChange} /></div>
            <div className="form-group col-span-12"><label>Número do Processo</label><input type="text" name="num_processo" value={formData.num_processo} onChange={handleChange} /></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="wizard-container">
      <StepIndicator />
      
      {step === 1 && <Step1 />}
      {/* Outros passos serão adicionados aqui */}

      <div className="wizard-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/orcamentos')}>Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Próximo</button>
      </div>
    </div>
  );
};

export default OrcamentoWizard;