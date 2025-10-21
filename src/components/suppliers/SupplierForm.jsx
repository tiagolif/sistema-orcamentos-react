import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Import custom UI components
import Button from '../ui/Button';
import Input from '../ui/Input';

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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">Cadastro de Fornecedores</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6 border border-gray-200 rounded-md overflow-hidden">
          <Button
            type="button"
            variant={formData.tipo_pessoa === 'pj' ? 'primary' : 'secondary'}
            onClick={() => handleTipoPessoaChange('pj')}
          >
            Pessoa Jurídica
          </Button>
          <Button
            type="button"
            variant={formData.tipo_pessoa === 'pf' ? 'primary' : 'secondary'}
            onClick={() => handleTipoPessoaChange('pf')}
          >
            Pessoa Física
          </Button>
        </div>

        {formData.tipo_pessoa === 'pj' ? 
          <PessoaJuridicaForm formData={formData} handleChange={handleChange} /> : 
          <PessoaFisicaForm formData={formData} handleChange={handleChange} />
        }

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/fornecedores" className="inline-block px-6 py-3 rounded-md font-semibold border border-accent text-accent transition-all duration-200 ease-in-out hover:bg-accent/10 hover:-translate-y-px">Voltar</Link>
          <Button type="submit" variant="primary">Salvar Fornecedor</Button>
        </div>
        {status && <p className={`mt-4 ${error ? 'text-red-600' : 'text-green-600'}`}>{status || error}</p>}
      </form>
    </div>
  );
}

const PessoaFisicaForm = ({ formData, handleChange }) => (
  <>
    <div className="grid grid-cols-2 gap-8"> {/* form-body-grid */}
      {/* --- COLUNA 1 --- */}
      <div>
        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados Pessoais</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
              <label htmlFor="nome_completo" className="text-sm font-medium flex-shrink-0">Nome Completo</label>
              <Input id="nome_completo" name="nome_completo" type="text" value={formData.nome_completo} onChange={handleChange} required />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="cpf" className="text-sm font-medium flex-shrink-0">CPF</label>
              <Input id="cpf" name="cpf" type="text" value={formData.cpf} onChange={handleChange} required />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="rg" className="text-sm font-medium flex-shrink-0">RG</label>
              <Input id="rg" name="rg" type="text" value={formData.rg} onChange={handleChange} />
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
    <div className="grid grid-cols-2 gap-8"> {/* form-body-grid */}
      {/* --- COLUNA 1 --- */}
      <div>
        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-gray-700 mb-4 border-b border-gray-200 pb-1.5">Dados Cadastrais</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
              <label htmlFor="razao_social" className="text-sm font-medium flex-shrink-0">Razão Social</label>
              <Input id="razao_social" name="razao_social" type="text" value={formData.razao_social} onChange={handleChange} required />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-7"> {/* form-group col-span-7 */}
              <label htmlFor="nome_fantasia" className="text-sm font-medium flex-shrink-0">Nome Fantasia</label>
              <Input id="nome_fantasia" name="nome_fantasia" type="text" value={formData.nome_fantasia} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-5"> {/* form-group col-span-5 */}
              <label htmlFor="cnpj" className="text-sm font-medium flex-shrink-0">CNPJ</label>
              <Input id="cnpj" name="cnpj" type="text" value={formData.cnpj} onChange={handleChange} required />
            </div>
          </div>
        </div>
        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Informações Fiscais</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="inscricao_estadual" className="text-sm font-medium flex-shrink-0">Inscrição Estadual</label>
              <Input id="inscricao_estadual" name="inscricao_estadual" type="text" value={formData.inscricao_estadual} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="inscricao_municipal">Inscrição Municipal</label>
              <Input id="inscricao_municipal" name="inscricao_municipal" type="text" value={formData.inscricao_municipal} onChange={handleChange} />
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
  <div className="mb-6"> {/* form-section */}
    <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Contato e Endereço</p> {/* form-section-title */}
    <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
        <div className="flex flex-row items-center gap-2 col-span-7"> {/* form-group col-span-7 */}
            <label htmlFor="pessoa_contato" className="text-sm font-medium flex-shrink-0">Pessoa de Contato</label>
            <Input id="pessoa_contato" name="pessoa_contato" type="text" value={formData.pessoa_contato} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-5"> {/* form-group col-span-5 */}
            <label htmlFor="email">E-mail</label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
            <label htmlFor="telefone">Telefone</label>
            <Input id="telefone" name="telefone" type="text" value={formData.telefone} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-3"> {/* form-group col-span-3 */}
            <label htmlFor="cep" className="text-sm font-medium flex-shrink-0">CEP</label>
            <Input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-9"> {/* form-group col-span-9 */}
            <label htmlFor="logradouro">Logradouro</label>
            <Input id="logradouro" name="logradouro" type="text" value={formData.logradouro} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-3"> {/* form-group col-span-3 */}
            <label htmlFor="numero">Número</label>
            <Input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-5"> {/* form-group col-span-5 */}
            <label htmlFor="complemento">Complemento</label>
            <Input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
            <label htmlFor="bairro">Bairro</label>
            <Input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-9"> {/* form-group col-span-9 */}
            <label htmlFor="cidade">Cidade</label>
            <Input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} />
        </div>
        <div className="flex flex-row items-center gap-2 col-span-3"> {/* form-group col-span-3 */}
            <label htmlFor="uf">UF</label>
            <Input id="uf" name="uf" type="text" value={formData.uf} onChange={handleChange} />
        </div>
    </div>
  </div>
);

const DadosFinanceirosForm = ({ formData, handleChange }) => (
    <div className="mb-6"> {/* form-section */}
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados Financeiros</p> {/* form-section-title */}
        <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
                <label htmlFor="banco" className="text-sm font-medium flex-shrink-0">Banco</label>
                <Input id="banco" name="banco" type="text" value={formData.banco} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
                <label htmlFor="agencia">Agência</label>
                <Input id="agencia" name="agencia" type="text" value={formData.agencia} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
                <label htmlFor="conta">Conta</label>
                <Input id="conta" name="conta" type="text" value={formData.conta} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
                <label htmlFor="chave_pix" className="text-sm font-medium flex-shrink-0">Chave PIX</label>
                <Input id="chave_pix" name="chave_pix" type="text" value={formData.chave_pix} onChange={handleChange} />
            </div>
        </div>
    </div>
);

const ClassificacaoForm = ({ formData, handleChange }) => (
    <div className="mb-6"> {/* form-section */}
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Classificação</p> {/* form-section-title */}
        <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
                <label htmlFor="categoria" className="text-sm font-medium flex-shrink-0">Categoria</label>
                <Input id="categoria" name="categoria" type="text" placeholder="Ex: Material de Construção, Elétrica" value={formData.categoria} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
                <label htmlFor="observacoes" className="text-sm font-medium flex-shrink-0">Observações</label>
                <Input as="textarea" id="observacoes" name="observacoes" placeholder="Detalhes importantes sobre o fornecedor..." value={formData.observacoes} onChange={handleChange} className="min-h-20 resize-y" />
            </div>
        </div>
    </div>
);