import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../ClientForm.css'; // Reutilizando os estilos do ClientForm

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const getInitialFormData = () => ({
  tipo_pessoa: 'pj',
  nome_completo: '',
  cpf: '',
  rg: '',
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  inscricao_municipal: '',
  pessoa_contato: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  banco: '',
  agencia: '',
  conta: '',
  chave_pix: '',
  categoria: '',
  observacoes: '',
});

export default function SupplierForm() {
  const [formData, setFormData] = useState(getInitialFormData());
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoPessoaChange = (tipo) => {
    const newState = {
      ...getInitialFormData(),
      tipo_pessoa: tipo,
    };
    setFormData(newState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Salvando...');
    setError('');

    let submissionData = { ...formData };

    if (submissionData.tipo_pessoa === 'pf') {
      Object.keys(submissionData).forEach(key => {
        if (['razao_social', 'nome_fantasia', 'cnpj', 'inscricao_estadual', 'inscricao_municipal'].includes(key)) {
          submissionData[key] = null;
        }
      });
    } else { // 'pj'
      Object.keys(submissionData).forEach(key => {
        if (['nome_completo', 'cpf', 'rg'].includes(key)) {
          submissionData[key] = null;
        }
      });
    }
    
    Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === '') {
            submissionData[key] = null;
        }
    });

    const { error: insertError } = await supabase.from('suppliers').insert([submissionData]);

    if (insertError) {
      setError(`Erro ao salvar fornecedor: ${insertError.message}`);
      setStatus('');
      console.error(insertError);
    } else {
      setStatus('Fornecedor salvo com sucesso!');
      setTimeout(() => navigate('/fornecedores'), 1500);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Fornecedores</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="type-selector">
          <button type="button" className={`type-selector-btn ${formData.tipo_pessoa === 'pj' ? 'selected' : ''}`} onClick={() => handleTipoPessoaChange('pj')}>
            Pessoa Jurídica
          </button>
          <button type="button" className={`type-selector-btn ${formData.tipo_pessoa === 'pf' ? 'selected' : ''}`} onClick={() => handleTipoPessoaChange('pf')}>
            Pessoa Física
          </button>
        </div>

        {formData.tipo_pessoa === 'pj' ? 
          <PessoaJuridicaForm formData={formData} handleChange={handleChange} /> : 
          <PessoaFisicaForm formData={formData} handleChange={handleChange} />
        }

        <div className="form-actions">
          <Link to="/fornecedores" className="btn btn-secondary">Voltar</Link>
          <button type="submit" className="btn btn-primary">Salvar Fornecedor</button>
        </div>
        {status && <p className={`status-message ${error ? 'error' : 'success'}`}>{status || error}</p>}
      </form>
    </div>
  );
}

const PessoaFisicaForm = ({ formData, handleChange }) => (
  <>
    <div className="form-body-grid">
      {/* --- COLUNA 1 --- */}
      <div>
        <div className="form-section">
          <p className="form-section-title">Dados Pessoais</p>
          <div className="form-grid">
            <div className="form-group col-span-12">
              <label htmlFor="nome_completo">Nome Completo</label>
              <input id="nome_completo" name="nome_completo" type="text" value={formData.nome_completo} onChange={handleChange} required />
            </div>
            <div className="form-group col-span-6">
              <label htmlFor="cpf">CPF</label>
              <input id="cpf" name="cpf" type="text" value={formData.cpf} onChange={handleChange} required />
            </div>
            <div className="form-group col-span-6">
              <label htmlFor="rg">RG</label>
              <input id="rg" name="rg" type="text" value={formData.rg} onChange={handleChange} />
            </div>
          </div>
        </div>
        <DadosFinanceirosForm formData={formData} handleChange={handleChange} />
      </div>

      {/* --- COLUNA 2 --- */}
      <div>
        <ContatoEnderecoForm formData={formData} handleChange={handleChange} />
      </div>
    </div>

    {/* --- LARGURA TOTAL --- */}
    <ClassificacaoForm formData={formData} handleChange={handleChange} />
  </>
);

const PessoaJuridicaForm = ({ formData, handleChange }) => (
  <>
    <div className="form-body-grid">
      {/* --- COLUNA 1 --- */}
      <div>
        <div className="form-section">
          <p className="form-section-title">Dados Cadastrais</p>
          <div className="form-grid">
            <div className="form-group col-span-12">
              <label htmlFor="razao_social">Razão Social</label>
              <input id="razao_social" name="razao_social" type="text" value={formData.razao_social} onChange={handleChange} required />
            </div>
            <div className="form-group col-span-7">
              <label htmlFor="nome_fantasia">Nome Fantasia</label>
              <input id="nome_fantasia" name="nome_fantasia" type="text" value={formData.nome_fantasia} onChange={handleChange} />
            </div>
            <div className="form-group col-span-5">
              <label htmlFor="cnpj">CNPJ</label>
              <input id="cnpj" name="cnpj" type="text" value={formData.cnpj} onChange={handleChange} required />
            </div>
          </div>
        </div>
        <div className="form-section">
          <p className="form-section-title">Informações Fiscais</p>
          <div className="form-grid">
            <div className="form-group col-span-6">
              <label htmlFor="inscricao_estadual">Inscrição Estadual</label>
              <input id="inscricao_estadual" name="inscricao_estadual" type="text" value={formData.inscricao_estadual} onChange={handleChange} />
            </div>
            <div className="form-group col-span-6">
              <label htmlFor="inscricao_municipal">Inscrição Municipal</label>
              <input id="inscricao_municipal" name="inscricao_municipal" type="text" value={formData.inscricao_municipal} onChange={handleChange} />
            </div>
          </div>
        </div>
        <DadosFinanceirosForm formData={formData} handleChange={handleChange} />
      </div>

      {/* --- COLUNA 2 --- */}
      <div>
        <ContatoEnderecoForm formData={formData} handleChange={handleChange} />
      </div>
    </div>

    {/* --- LARGURA TOTAL --- */}
    <ClassificacaoForm formData={formData} handleChange={handleChange} />
  </>
);

const ContatoEnderecoForm = ({ formData, handleChange }) => (
  <div className="form-section">
    <p className="form-section-title">Contato e Endereço</p>
    <div className="form-grid">
        <div className="form-group col-span-7">
            <label htmlFor="pessoa_contato">Pessoa de Contato</label>
            <input id="pessoa_contato" name="pessoa_contato" type="text" value={formData.pessoa_contato} onChange={handleChange} />
        </div>
        <div className="form-group col-span-5">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group col-span-12">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" name="telefone" type="text" value={formData.telefone} onChange={handleChange} />
        </div>
        <div className="form-group col-span-3">
            <label htmlFor="cep">CEP</label>
            <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} />
        </div>
        <div className="form-group col-span-9">
            <label htmlFor="logradouro">Logradouro</label>
            <input id="logradouro" name="logradouro" type="text" value={formData.logradouro} onChange={handleChange} />
        </div>
        <div className="form-group col-span-3">
            <label htmlFor="numero">Número</label>
            <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} />
        </div>
        <div className="form-group col-span-5">
            <label htmlFor="complemento">Complemento</label>
            <input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} />
        </div>
        <div className="form-group col-span-4">
            <label htmlFor="bairro">Bairro</label>
            <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} />
        </div>
        <div className="form-group col-span-9">
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} />
        </div>
        <div className="form-group col-span-3">
            <label htmlFor="uf">UF</label>
            <input id="uf" name="uf" type="text" value={formData.uf} onChange={handleChange} />
        </div>
    </div>
  </div>
);

const DadosFinanceirosForm = ({ formData, handleChange }) => (
    <div className="form-section">
        <p className="form-section-title">Dados Financeiros</p>
        <div className="form-grid">
            <div className="form-group col-span-4">
                <label htmlFor="banco">Banco</label>
                <input id="banco" name="banco" type="text" value={formData.banco} onChange={handleChange} />
            </div>
            <div className="form-group col-span-4">
                <label htmlFor="agencia">Agência</label>
                <input id="agencia" name="agencia" type="text" value={formData.agencia} onChange={handleChange} />
            </div>
            <div className="form-group col-span-4">
                <label htmlFor="conta">Conta</label>
                <input id="conta" name="conta" type="text" value={formData.conta} onChange={handleChange} />
            </div>
            <div className="form-group col-span-12">
                <label htmlFor="chave_pix">Chave PIX</label>
                <input id="chave_pix" name="chave_pix" type="text" value={formData.chave_pix} onChange={handleChange} />
            </div>
        </div>
    </div>
);

const ClassificacaoForm = ({ formData, handleChange }) => (
    <div className="form-section">
        <p className="form-section-title">Classificação</p>
        <div className="form-grid">
            <div className="form-group col-span-12">
                <label htmlFor="categoria">Categoria</label>
                <input id="categoria" name="categoria" type="text" placeholder="Ex: Material de Construção, Elétrica" value={formData.categoria} onChange={handleChange} />
            </div>
            <div className="form-group col-span-12">
                <label htmlFor="observacoes">Observações</label>
                <textarea id="observacoes" name="observacoes" placeholder="Detalhes importantes sobre o fornecedor..." value={formData.observacoes} onChange={handleChange}></textarea>
            </div>
        </div>
    </div>
);