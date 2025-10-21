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

// Schema para campos comuns a PF e PJ
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
  observacoes: z.string().optional().or(z.literal('')),
});

// Schema para Pessoa Física
const pessoaFisicaSchema = commonSchema.extend({
  tipo_pessoa: z.literal('pf'),
  nome_completo: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'), // Ex: 000.000.000-00
});

// Schema para Pessoa Jurídica
const pessoaJuridicaSchema = commonSchema.extend({
  tipo_pessoa: z.literal('pj'),
  razao_social: z.string().min(1, 'Razão Social é obrigatória'),
  nome_fantasia: z.string().optional().or(z.literal('')),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18, 'CNPJ inválido'), // Ex: 00.000.000/0001-00
  inscricao_estadual: z.string().optional().or(z.literal('')),
  inscricao_municipal: z.string().optional().or(z.literal('')),
  pessoa_contato: z.string().optional().or(z.literal('')),
});

// Schema principal que discrimina entre PF e PJ
const clientSchema = z.discriminatedUnion('tipo_pessoa', [
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
]);

// --- Componente Principal ClientForm ---

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipoPessoa, setTipoPessoa] = useState('pf'); // Controla o tipo de pessoa para o formulário

  const { 
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      tipo_pessoa: 'pf', // Garante que o tipo_pessoa inicial seja 'pf'
      nome_completo: '',
      razao_social: '',
      nome_fantasia: '',
      cpf: '',
      cnpj: '',
      inscricao_estadual: '',
      inscricao_municipal: '',
      email: '',
      telefone: '',
      pessoa_contato: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      observacoes: '',
    },
    mode: 'onBlur', // Valida no blur e no submit
  });

  // Observa o tipo_pessoa para alternar o esquema de validação dinamicamente
  const watchedTipoPessoa = watch('tipo_pessoa', tipoPessoa);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        reset({
          tipo_pessoa: 'pf',
          nome_completo: '',
          razao_social: '',
          nome_fantasia: '',
          cpf: '',
          cnpj: '',
          inscricao_estadual: '',
          inscricao_municipal: '',
          email: '',
          telefone: '',
          pessoa_contato: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
          observacoes: '',
        }); // Reseta o formulário para valores iniciais
        return;
      }

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erro ao carregar cliente: ${error.message}`);
        // Tratar erro de carregamento, talvez exibir mensagem ao usuário
      } else if (data) {
        // Atualiza o tipo de pessoa e os valores do formulário
        setTipoPessoa(data.tipo_pessoa);
        reset({ ...data, tipo_pessoa: data.tipo_pessoa });
      }
    };

    fetchClient();
  }, [id, reset]);

  // Atualiza o tipo de pessoa no formulário e reseta campos específicos
  const handleTipoPessoaChange = (tipo) => {
    setTipoPessoa(tipo);
    setValue('tipo_pessoa', tipo);
    // Limpa campos específicos ao trocar o tipo de pessoa para evitar validação cruzada
    if (tipo === 'pf') {
      setValue('razao_social', '');
      setValue('nome_fantasia', '');
      setValue('cnpj', '');
      setValue('inscricao_estadual', '');
      setValue('inscricao_municipal', '');
      setValue('pessoa_contato', '');
    } else { // pj
      setValue('nome_completo', '');
      setValue('cpf', '');
    }
  };

  const onSubmit = async (data) => {
    // Limpa campos que não pertencem ao tipo de pessoa atual antes de enviar
    const submissionData = { ...data };
    if (submissionData.tipo_pessoa === 'pf') {
      delete submissionData.razao_social;
      delete submissionData.nome_fantasia;
      delete submissionData.cnpj;
      delete submissionData.inscricao_estadual;
      delete submissionData.inscricao_municipal;
      delete submissionData.pessoa_contato;
    } else { // pj
      delete submissionData.nome_completo;
      delete submissionData.cpf;
    }

    const { error: submissionError } = id
      ? await supabase.from('clientes').update(submissionData).eq('id', id)
      : await supabase.from('clientes').insert(submissionData);

    if (submissionError) {
      console.error(`Erro ao salvar: ${submissionError.message}`);
      // Exibir erro ao usuário
    } else {
      console.log(id ? 'Cliente atualizado com sucesso!' : 'Cliente salvo com sucesso!');
      navigate('/clientes');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">{id ? 'Editar Cliente' : 'Cadastro de Clientes'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center mb-6 border border-gray-200 rounded-md overflow-hidden">
          <Button
            type="button"
            variant={watchedTipoPessoa === 'pf' ? 'primary' : 'secondary'}
            onClick={() => handleTipoPessoaChange('pf')}
          >
            Pessoa Física
          </Button>
          <Button
            type="button"
            variant={watchedTipoPessoa === 'pj' ? 'primary' : 'secondary'}
            onClick={() => handleTipoPessoaChange('pj')}
          >
            Pessoa Jurídica
          </Button>
        </div>

        {watchedTipoPessoa === 'pf' ? (
          <PessoaFisicaForm register={register} errors={errors} />
        ) : (
          <PessoaJuridicaForm register={register} errors={errors} />
        )}

        <EnderecoForm register={register} errors={errors} />
        <ObservacoesForm register={register} errors={errors} />

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/clientes" className="inline-block px-6 py-3 rounded-md font-semibold border border-accent text-accent transition-all duration-200 ease-in-out hover:bg-accent/10 hover:-translate-y-px">Voltar</Link>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// --- Sub-componentes adaptados para React Hook Form ---

const PessoaFisicaForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados Pessoais</p>
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-row items-center gap-2 col-span-12">
        <label htmlFor="nome_completo" className="text-sm font-medium flex-shrink-0">Nome Completo</label>
        <Input id="nome_completo" type="text" placeholder="Nome Completo" {...register('nome_completo')} />
        {errors.nome_completo && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.nome_completo.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="cpf" className="text-sm font-medium flex-shrink-0">CPF</label>
        <Input id="cpf" type="text" placeholder="000.000.000-00" {...register('cpf')} />
        {errors.cpf && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.cpf.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="email" className="text-sm font-medium flex-shrink-0">E-mail</label>
        <Input id="email" type="email" placeholder="contato@email.com" {...register('email')} />
        {errors.email && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.email.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="telefone" className="text-sm font-medium flex-shrink-0">Telefone</label>
        <Input id="telefone" type="text" placeholder="(00) 90000-0000" {...register('telefone')} />
        {errors.telefone && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.telefone.message}</p>}
      </div>
    </div>
  </div>
);

const PessoaJuridicaForm = ({ register, errors }) => (
  <>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Dados da Empresa</p>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-row items-center gap-2 col-span-6">
          <label htmlFor="razao_social" className="text-sm font-medium flex-shrink-0">Razão Social</label>
          <Input id="razao_social" type="text" placeholder="Razão Social" {...register('razao_social')} />
          {errors.razao_social && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.razao_social.message}</p>}
        </div>
        <div className="flex flex-row items-center gap-2 col-span-6">
          <label htmlFor="nome_fantasia" className="text-sm font-medium flex-shrink-0">Nome Fantasia</label>
          <Input id="nome_fantasia" type="text" placeholder="Nome Fantasia" {...register('nome_fantasia')} />
          {errors.nome_fantasia && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.nome_fantasia.message}</p>}
        </div>
        <div className="flex flex-row items-center gap-2 col-span-6">
          <label htmlFor="cnpj" className="text-sm font-medium flex-shrink-0">CNPJ</label>
          <Input id="cnpj" type="text" placeholder="00.000.000/0001-00" {...register('cnpj')} />
          {errors.cnpj && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.cnpj.message}</p>}
        </div>
      </div>
    </div>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Contato</p>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-row items-center gap-2 col-span-4">
          <label htmlFor="pessoa_contato" className="text-sm font-medium flex-shrink-0">Pessoa de Contato</label>
          <Input id="pessoa_contato" type="text" placeholder="Nome do contato" {...register('pessoa_contato')} />
          {errors.pessoa_contato && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.pessoa_contato.message}</p>}
        </div>
        <div className="flex flex-row items-center gap-2 col-span-4">
          <label htmlFor="email" className="text-sm font-medium flex-shrink-0">E-mail</label>
          <Input id="email" type="email" placeholder="contato@empresa.com" {...register('email')} />
          {errors.email && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.email.message}</p>}
        </div>
        <div className="flex flex-row items-center gap-2 col-span-4">
          <label htmlFor="telefone" className="text-sm font-medium flex-shrink-0">Telefone</label>
          <Input id="telefone" type="text" placeholder="(00) 0000-0000" {...register('telefone')} />
          {errors.telefone && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.telefone.message}</p>}
        </div>
      </div>
    </div>
    <div className="mb-6">
      <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Informações Fiscais</p>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-row items-center gap-2 col-span-6">
          <label htmlFor="inscricao_estadual" className="text-sm font-medium flex-shrink-0">Inscrição Estadual</label>
          <Input id="inscricao_estadual" type="text" placeholder="Número da Inscrição Estadual" {...register('inscricao_estadual')} />
          {errors.inscricao_estadual && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.inscricao_estadual.message}</p>}
        </div>
        <div className="flex flex-row items-center gap-2 col-span-6">
          <label htmlFor="inscricao_municipal" className="text-sm font-medium flex-shrink-0">Inscrição Municipal</label>
          <Input id="inscricao_municipal" type="text" placeholder="Número da Inscrição Municipal" {...register('inscricao_municipal')} />
          {errors.inscricao_municipal && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.inscricao_municipal.message}</p>}
        </div>
      </div>
    </div>
  </>
);

const EnderecoForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Endereço</p>
    <div className="grid grid-cols-12 gap-4">
      <div className="flex flex-row items-center gap-2 col-span-3">
        <label htmlFor="cep" className="text-sm font-medium flex-shrink-0">CEP</label>
        <Input id="cep" type="text" placeholder="00000-000" {...register('cep')} />
        {errors.cep && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.cep.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-9">
        <label htmlFor="logradouro" className="text-sm font-medium flex-shrink-0">Logradouro</label>
        <Input id="logradouro" type="text" placeholder="Rua, Avenida, etc." {...register('logradouro')} />
        {errors.logradouro && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.logradouro.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-2">
        <label htmlFor="numero" className="text-sm font-medium flex-shrink-0">Número</label>
        <Input id="numero" type="text" placeholder="Nº" {...register('numero')} />
        {errors.numero && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.numero.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="complemento" className="text-sm font-medium flex-shrink-0">Complemento</label>
        <Input id="complemento" type="text" placeholder="Apto, Bloco, etc." {...register('complemento')} />
        {errors.complemento && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.complemento.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="bairro" className="text-sm font-medium flex-shrink-0">Bairro</label>
        <Input id="bairro" type="text" placeholder="Bairro" {...register('bairro')} />
        {errors.bairro && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.bairro.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-9">
        <label htmlFor="cidade" className="text-sm font-medium flex-shrink-0">Cidade</label>
        <Input id="cidade" type="text" placeholder="Cidade" {...register('cidade')} />
        {errors.cidade && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.cidade.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-3">
        <label htmlFor="uf" className="text-sm font-medium flex-shrink-0">UF</label>
        <Input id="uf" type="text" placeholder="Estado" {...register('uf')} />
        {errors.uf && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.uf.message}</p>}
      </div>
    </div>
  </div>
);

const ObservacoesForm = ({ register, errors }) => (
    <div className="mb-6">
        <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Observações</p>
        <div className="grid grid-cols-12 gap-4">
            <div className="flex flex-row items-center gap-2 col-span-12">
                <label htmlFor="observacoes" className="text-sm font-medium flex-shrink-0">Observações Adicionais</label>
                <Input as="textarea" id="observacoes" placeholder="Detalhes importantes, restrições, etc." {...register('observacoes')} className="min-h-20 resize-y" />
                {errors.observacoes && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.observacoes.message}</p>}
            </div>
        </div>
    </div>
);