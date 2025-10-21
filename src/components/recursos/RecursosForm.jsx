import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Input from '../ui/Input';

const getInitialFormData = () => ({
  tipo_recurso: 'CLT',
  // Comuns
  nome_razao_social: '',
  cpf_cnpj: '',
  telefone: '',
  email: '',
  observacoes: '',
  // CLT
  cargo: '',
  data_admissao: '',
  salario_base: '',
  // Autônomo
  profissao: '',
  // Equipamento
  descricao_equipamento: '',
  modelo_equipamento: '',
  fornecedor_id: '',
  // Serviço
  descricao_servico: '',
  // Novos campos de valor
  valor: '',
  unidade_pagamento: 'Hora',
});

export default function RecursosForm() {
  const [formData, setFormData] = useState(getInitialFormData());
  const [suppliers, setSuppliers] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Busca fornecedores para os selects
  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase.from('suppliers').select('id, name');
      if (!error) {
        setSuppliers(data);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData({ ...getInitialFormData(), tipo_recurso: type });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Salvando...');
    setError('');

    let submissionData = { ...formData };

    // Limpa campos vazios
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] === '') {
        submissionData[key] = null;
      }
    });

    const { error: insertError } = await supabase.from('recursos').insert([submissionData]);

    if (insertError) {
      setError(`Erro ao salvar recurso: ${insertError.message}`);
      setStatus('');
      console.error(insertError);
    } else {
      setStatus('Recurso salvo com sucesso!');
      setTimeout(() => navigate('/recursos'), 1500);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Recurso</h2>
      <form onSubmit={handleSubmit}>
        <div className="type-selector">
          <Button type="button" variant={formData.tipo_recurso === 'CLT' ? 'primary' : 'secondary'} onClick={() => handleTypeChange('CLT')}>
            Funcionário (CLT)
          </Button>
          <Button type="button" variant={formData.tipo_recurso === 'AUTONOMO' ? 'primary' : 'secondary'} onClick={() => handleTypeChange('AUTONOMO')}>
            Autônomo
          </Button>
          <Button type="button" variant={formData.tipo_recurso === 'EQUIPAMENTO' ? 'primary' : 'secondary'} onClick={() => handleTypeChange('EQUIPAMENTO')}>
            Equipamento
          </Button>
          <Button type="button" variant={formData.tipo_recurso === 'SERVICO' ? 'primary' : 'secondary'} onClick={() => handleTypeChange('SERVICO')}>
            Serviço (Terceirizado)
          </Button>
        </div>

        {formData.tipo_recurso === 'CLT' && <FormCLT formData={formData} handleChange={handleChange} />}
        {formData.tipo_recurso === 'AUTONOMO' && <FormAutonomo formData={formData} handleChange={handleChange} />}
        {formData.tipo_recurso === 'EQUIPAMENTO' && <FormEquipamento formData={formData} handleChange={handleChange} suppliers={suppliers} />}
        {formData.tipo_recurso === 'SERVICO' && <FormServico formData={formData} handleChange={handleChange} suppliers={suppliers} />}

        <div className="form-actions">
          <Link to="/recursos" className="btn btn-secondary">Cancelar</Link>
          <Button type="submit" variant="primary">Salvar Recurso</Button>
        </div>
        {status && <p className={`status-message ${error ? 'error' : 'success'}`}>{status || error}</p>}
      </form>
    </div>
  );
}

// --- Sub-componentes do Formulário ---

const FormCLT = ({ formData, handleChange }) => (
  <>
    <div className="form-section">
      <p className="form-section-title">Dados do Funcionário</p>
      <div className="form-grid">
        <div className="form-group col-span-8"><label>Nome Completo</label><input name="nome_razao_social" value={formData.nome_razao_social} onChange={handleChange} required /></div>
        <div className="form-group col-span-4"><label>CPF</label><input name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} required /></div>
        <div className="form-group col-span-6"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
        <div className="form-group col-span-6"><label>Telefone</label><input name="telefone" value={formData.telefone} onChange={handleChange} /></div>
      </div>
    </div>
    <div className="form-section">
      <p className="form-section-title">Detalhes do Contrato</p>
      <div className="form-grid">
        <div className="form-group col-span-6"><label>Cargo</label><input name="cargo" value={formData.cargo} onChange={handleChange} /></div>
        <div className="form-group col-span-6"><label>Data de Admissão</label><input type="date" name="data_admissao" value={formData.data_admissao} onChange={handleChange} /></div>
        <div className="form-group col-span-6"><label>Salário Base (R$)</label><input type="number" name="salario_base" value={formData.salario_base} onChange={handleChange} /></div>
      </div>
    </div>
  </>
);

const FormAutonomo = ({ formData, handleChange }) => (
  <>
    <div className="form-section">
      <p className="form-section-title">Dados do Profissional Autônomo</p>
      <div className="form-grid">
        <div className="form-group col-span-8"><label>Nome</label><input name="nome_razao_social" value={formData.nome_razao_social} onChange={handleChange} required /></div>
        <div className="form-group col-span-4"><label>CPF/CNPJ</label><input name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} /></div>
        <div className="form-group col-span-6"><label>Telefone</label><input name="telefone" value={formData.telefone} onChange={handleChange} /></div>
        <div className="form-group col-span-6"><label>Profissão</label><input name="profissao" value={formData.profissao} onChange={handleChange} placeholder="Ex: Pedreiro" /></div>
      </div>
    </div>
    <div className="form-section">
      <p className="form-section-title">Valores</p>
      <div className="form-grid">
        <div className="form-group col-span-6">
          <label>Valor (R$)</label>
          <input type="number" name="valor" value={formData.valor} onChange={handleChange} />
        </div>
        <div className="form-group col-span-6">
          <label>Unidade de Pagamento</label>
          <select name="unidade_pagamento" value={formData.unidade_pagamento} onChange={handleChange}>
            <option value="Hora">Hora</option>
            <option value="Dia">Dia</option>
            <option value="Semana">Semana</option>
            <option value="Quinzena">Quinzena</option>
            <option value="Mês">Mês</option>
            <option value="Empreitada">Empreitada</option>
          </select>
        </div>
      </div>
    </div>
  </>
);

const FormEquipamento = ({ formData, handleChange, suppliers }) => (
  <>
    <div className="form-section">
      <p className="form-section-title">Dados do Equipamento</p>
      <div className="form-grid">
        <div className="form-group col-span-6"><label>Descrição</label><input name="descricao_equipamento" value={formData.descricao_equipamento} onChange={handleChange} placeholder="Ex: Retroescavadeira" required /></div>
        <div className="form-group col-span-6"><label>Modelo/Marca</label><input name="modelo_equipamento" value={formData.modelo_equipamento} onChange={handleChange} placeholder="Ex: Case 580N" /></div>
        <div className="form-group col-span-12">
          <label>Fornecedor</label>
          <select name="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange}>
            <option value="">Selecione um fornecedor</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
    </div>
    <div className="form-section">
      <p className="form-section-title">Valores</p>
      <div className="form-grid">
        <div className="form-group col-span-6">
          <label>Valor (R$)</label>
          <input type="number" name="valor" value={formData.valor} onChange={handleChange} />
        </div>
        <div className="form-group col-span-6">
          <label>Unidade de Pagamento</label>
          <select name="unidade_pagamento" value={formData.unidade_pagamento} onChange={handleChange}>
            <option value="Hora">Hora</option>
            <option value="Dia">Dia</option>
            <option value="Semana">Semana</option>
            <option value="Quinzena">Quinzena</option>
            <option value="Mês">Mês</option>
          </select>
        </div>
      </div>
    </div>
  </>
);

const FormServico = ({ formData, handleChange, suppliers }) => (
  <>
    <div className="form-section">
      <p className="form-section-title">Dados do Serviço Terceirizado</p>
      <div className="form-grid">
        <div className="form-group col-span-12"><label>Descrição do Serviço</label><input name="descricao_servico" value={formData.descricao_servico} onChange={handleChange} placeholder="Ex: Serviço de Topografia" required /></div>
        <div className="form-group col-span-12">
          <label>Empresa Prestadora (Fornecedor)</label>
          <select name="fornecedor_id" value={formData.fornecedor_id} onChange={handleChange}>
            <option value="">Selecione um fornecedor</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
    </div>
    <div className="form-section">
      <p className="form-section-title">Valores</p>
      <div className="form-grid">
        <div className="form-group col-span-6">
          <label>Valor (R$)</label>
          <input type="number" name="valor" value={formData.valor} onChange={handleChange} />
        </div>
        <div className="form-group col-span-6">
          <label>Unidade de Pagamento</label>
          <select name="unidade_pagamento" value={formData.unidade_pagamento} onChange={handleChange}>
            <option value="Hora">Hora</option>
            <option value="Dia">Dia</option>
            <option value="Semana">Semana</option>
            <option value="Quinzena">Quinzena</option>
            <option value="Mês">Mês</option>
            <option value="Empreitada">Empreitada</option>
          </select>
        </div>
      </div>
    </div>
  </>
);