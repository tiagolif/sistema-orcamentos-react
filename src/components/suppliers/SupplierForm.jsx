import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import custom UI components
import Button from '../ui/Button';
import Input from '../ui/Input';

// --- Zod Schemas ---
const commonSchema = z.object({
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  cep: z.string().optional().or(z.literal('')),
  logradouro: z.string().optional().or(z.literal('')),
  numero: z.string().optional().or(z.literal('')),
  complemento: z.string().optional().or(z.literal('')),
  bairro: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  uf: z.string().optional().or(z.literal('')),
  banco: z.string().optional().or(z.literal('')),
  agencia: z.string().optional().or(z.literal('')),
  conta: z.string().optional().or(z.literal('')),
  chave_pix: z.string().optional().or(z.literal('')),
  categoria: z.string().optional().or(z.literal('')),
  observacoes: z.string().optional().or(z.literal('')),
});

const pessoaFisicaSchema = commonSchema.extend({
  tipo_pessoa: z.literal('pf'),
  nome_completo: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().optional().or(z.literal('')),
  rg: z.string().optional().or(z.literal('')),
});

const pessoaJuridicaSchema = commonSchema.extend({
  tipo_pessoa: z.literal('pj'),
  razao_social: z.string().min(1, 'Razão Social é obrigatória'),
  nome_fantasia: z.string().optional().or(z.literal('')),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  inscricao_estadual: z.string().optional().or(z.literal('')),
  inscricao_municipal: z.string().optional().or(z.literal('')),
  pessoa_contato: z.string().optional().or(z.literal('')),
});

const supplierSchema = z.discriminatedUnion('tipo_pessoa', [
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
]);

// --- Componente Principal ---
export default function SupplierForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: { tipo_pessoa: 'pj' },
  });

  const watchedTipoPessoa = watch('tipo_pessoa', 'pj');

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) {
        reset({ tipo_pessoa: 'pj' });
        return;
      }
      const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
      if (error) {
        console.error(`Erro ao carregar fornecedor: ${error.message}`);
      } else if (data) {
        reset({ ...data, tipo_pessoa: data.tipo_pessoa });
      }
    };
    fetchSupplier();
  }, [id, reset]);

  const handleTipoPessoaChange = (tipo) => {
    setValue('tipo_pessoa', tipo, { shouldValidate: true });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setStatus('Salvando...');
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setError('Erro: Usuário não autenticado.');
        setStatus('');
        return;
    }

    const submissionData = { ...data, user_id: user.id };
    
    if (submissionData.tipo_pessoa === 'pf') {
      Object.assign(submissionData, { razao_social: null, nome_fantasia: null, cnpj: null, inscricao_estadual: null, inscricao_municipal: null, pessoa_contato: null });
    } else {
      Object.assign(submissionData, { nome_completo: null, cpf: null, rg: null });
    }

    const { data: savedSupplier, error: submissionError } = id
      ? await supabase.from('suppliers').update(submissionData).eq('id', id).select().single()
      : await supabase.from('suppliers').insert(submissionData).select().single();

    if (submissionError) {
      setError(`Erro ao salvar fornecedor: ${submissionError.message}`);
      setStatus('');
      return;
    }

    if (files.length > 0) {
      setStatus('Salvando anexos...');
      for (const file of files) {
        const { error: uploadError } = await supabase.storage
          .from('documentos_fornecedores')
          .upload(`${savedSupplier.id}/${file.name}`, file, {
            upsert: true,
          });
        if (uploadError) {
          setError(`Erro no upload do anexo ${file.name}: ${uploadError.message}`);
          return; 
        }
      }
    }

    setStatus('Fornecedor salvo com sucesso!');
    setTimeout(() => navigate('/fornecedores'), 1500);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">{id ? 'Editar Fornecedor' : 'Cadastro de Fornecedores'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center mb-6 border border-gray-200 rounded-md overflow-hidden w-fit mx-auto">
          <Button type="button" variant={watchedTipoPessoa === 'pj' ? 'primary' : 'secondary'} onClick={() => handleTipoPessoaChange('pj')} className="rounded-none">Pessoa Jurídica</Button>
          <Button type="button" variant={watchedTipoPessoa === 'pf' ? 'primary' : 'secondary'} onClick={() => handleTipoPessoaChange('pf')} className="rounded-none">Pessoa Física</Button>
        </div>

        {watchedTipoPessoa === 'pj' ? 
          <PessoaJuridicaForm register={register} errors={errors} /> : 
          <PessoaFisicaForm register={register} errors={errors} />
        }
        
        <EnderecoForm register={register} errors={errors} />
        <DadosFinanceirosForm register={register} errors={errors} />
        <ClassificacaoForm register={register} errors={errors} />
        <AnexosForm handleFileChange={handleFileChange} />

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/fornecedores" className="btn-secondary">Voltar</Link>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Fornecedor'}</Button>
        </div>
        {status && <p className={`mt-4 text-center ${error ? 'text-red-600' : 'text-green-600'}`}>{status || error}</p>}
      </form>
    </div>
  );
}

// --- Sub-componentes ---

const FormField = ({ label, id, span, error, children }) => (
    <div className={`col-span-12 md:col-span-${span}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

const PessoaFisicaForm = ({ register, errors }) => (
    <div className="mb-6">
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados Pessoais</p>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <FormField label="Nome Completo" id="nome_completo" span={12} error={errors.nome_completo}>
                <Input id="nome_completo" type="text" {...register('nome_completo')} />
            </FormField>
            <FormField label="CPF" id="cpf" span={6} error={errors.cpf}>
                <Input id="cpf" type="text" {...register('cpf')} />
            </FormField>
            <FormField label="RG" id="rg" span={6}>
                <Input id="rg" type="text" {...register('rg')} />
            </FormField>
        </div>
    </div>
);

const PessoaJuridicaForm = ({ register, errors }) => (
  <>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados da Empresa</p>
      <div className="grid grid-cols-12 gap-x-4 gap-y-2">
        <FormField label="Razão Social" id="razao_social" span={7} error={errors.razao_social}>
          <Input id="razao_social" type="text" {...register('razao_social')} />
        </FormField>
        <FormField label="Nome Fantasia" id="nome_fantasia" span={5} error={errors.nome_fantasia}>
          <Input id="nome_fantasia" type="text" {...register('nome_fantasia')} />
        </FormField>
        <FormField label="CNPJ" id="cnpj" span={12} error={errors.cnpj}>
          <Input id="cnpj" type="text" {...register('cnpj')} />
        </FormField>
      </div>
    </div>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Informações Fiscais</p>
      <div className="grid grid-cols-12 gap-x-4 gap-y-2">
        <FormField label="Inscrição Estadual" id="inscricao_estadual" span={6}>
          <Input id="inscricao_estadual" type="text" {...register('inscricao_estadual')} />
        </FormField>
        <FormField label="Inscrição Municipal" id="inscricao_municipal" span={6}>
          <Input id="inscricao_municipal" type="text" {...register('inscricao_municipal')} />
        </FormField>
      </div>
    </div>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Contato</p>
      <div className="grid grid-cols-12 gap-x-4 gap-y-2">
        <FormField label="Pessoa de Contato" id="pessoa_contato" span={4}>
          <Input id="pessoa_contato" type="text" {...register('pessoa_contato')} />
        </FormField>
        <FormField label="E-mail" id="email" span={4} error={errors.email}>
          <Input id="email" type="email" {...register('email')} />
        </FormField>
        <FormField label="Telefone" id="telefone" span={4}>
          <Input id="telefone" type="text" {...register('telefone')} />
        </FormField>
      </div>
    </div>
  </>
);

const EnderecoForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Endereço</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <FormField label="CEP" id="cep" span={3}>
        <Input id="cep" type="text" {...register('cep')} />
      </FormField>
      <FormField label="Logradouro" id="logradouro" span={9}>
        <Input id="logradouro" type="text" {...register('logradouro')} />
      </FormField>
      <FormField label="Nº" id="numero" span={2}>
        <Input id="numero" type="text" {...register('numero')} />
      </FormField>
      <FormField label="Complemento" id="complemento" span={4}>
        <Input id="complemento" type="text" {...register('complemento')} />
      </FormField>
      <FormField label="Bairro" id="bairro" span={6}>
        <Input id="bairro" type="text" {...register('bairro')} />
      </FormField>
      <FormField label="Cidade" id="cidade" span={9}>
        <Input id="cidade" type="text" {...register('cidade')} />
      </FormField>
      <FormField label="UF" id="uf" span={3}>
        <Input id="uf" type="text" {...register('uf')} />
      </FormField>
    </div>
  </div>
);

const DadosFinanceirosForm = ({ register, errors }) => (
    <div className="mb-6">
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados Financeiros</p>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <FormField label="Banco" id="banco" span={3}>
                <Input id="banco" type="text" {...register('banco')} />
            </FormField>
            <FormField label="Agência" id="agencia" span={3}>
                <Input id="agencia" type="text" {...register('agencia')} />
            </FormField>
            <FormField label="Conta" id="conta" span={3}>
                <Input id="conta" type="text" {...register('conta')} />
            </FormField>
            <FormField label="Chave PIX" id="chave_pix" span={3}>
                <Input id="chave_pix" type="text" {...register('chave_pix')} />
            </FormField>
        </div>
    </div>
);

const ClassificacaoForm = ({ register, errors }) => (
    <div className="mb-6">
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Classificação e Observações</p>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <FormField label="Categoria" id="categoria" span={12}>
                <Input id="categoria" type="text" placeholder="Ex: Material de Construção, Elétrica" {...register('categoria')} />
            </FormField>
            <FormField label="Observações" id="observacoes" span={12}>
                <Input as="textarea" id="observacoes" placeholder="Detalhes importantes sobre o fornecedor..." {...register('observacoes')} className="min-h-20 resize-y" />
            </FormField>
        </div>
    </div>
);

const AnexosForm = ({ handleFileChange }) => (
    <div className="mb-6">
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Anexos</p>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <div className="col-span-12">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Documentos</label>
                <input id="file-upload" name="file-upload" type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-light file:text-accent-dark hover:file:bg-accent/20" />
            </div>
        </div>
    </div>
);