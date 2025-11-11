import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import custom UI components
import Button from '../ui/Button';
import Input from '../ui/Input';

// --- Zod Schema ---
const recursoSchema = z.object({
  nome_completo: z.string().min(1, 'O nome completo é obrigatório.'),
  funcao: z.string().optional().or(z.literal('')),
  tipo_contrato: z.string().min(1, 'O tipo de contrato é obrigatório.'),
  custo_hora: z.number().positive('O custo/hora deve ser positivo.'),
  custo_diaria: z.number().positive('O custo/diária deve ser positivo.').optional().or(z.literal(0)),
  cpf: z.string().optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  data_admissao: z.string().optional().or(z.literal('')),
  status: z.string().optional(),
});

// --- Componente Principal ---
const RecursosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(recursoSchema),
    defaultValues: {
      tipo_contrato: 'CLT',
      status: 'Ativo',
      custo_diaria: 0,
    },
  });

  useEffect(() => {
    const fetchRecurso = async () => {
      if (!id) {
        reset({ tipo_contrato: 'CLT', status: 'Ativo', custo_diaria: 0 });
        return;
      }
      const { data, error } = await supabase
        .from('recursos_humanos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erro ao carregar recurso: ${error.message}`);
      } else if (data) {
        reset(data);
      }
    };
    fetchRecurso();
  }, [id, reset]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setStatusMessage('Salvando...');
    setErrorMessage('');

    const submissionData = { ...data };
    // Convert empty date strings to null for Supabase
    submissionData.data_admissao = submissionData.data_admissao || null;
    // Convert 0 to null for optional numeric fields if they are not required
    submissionData.custo_diaria = submissionData.custo_diaria === 0 ? null : submissionData.custo_diaria;

    const { data: savedRecurso, error: submissionError } = id
      ? await supabase.from('recursos_humanos').update(submissionData).eq('id', id).select().single()
      : await supabase.from('recursos_humanos').insert(submissionData).select().single();

    if (submissionError) {
      setErrorMessage(`Erro ao salvar recurso: ${submissionError.message}`);
      setStatusMessage('');
      console.error('Error inserting data:', submissionError);
      return;
    }

    if (files.length > 0) {
      setStatusMessage('Salvando anexos...');
      for (const file of files) {
        // Sanitize filename
        const fileExt = file.name.split('.').pop();
        const newFileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const caminho = `${savedRecurso.id}/${newFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documentos_recursos')
          .upload(caminho, file, {
            upsert: true,
          });
        if (uploadError) {
          setErrorMessage(`Erro no upload do anexo ${file.name}: ${uploadError.message}`);
          setStatusMessage('');
          console.error('Error uploading file:', uploadError);
          return;
        }
      }
    }

    setStatusMessage('Recurso salvo com sucesso!');
    setTimeout(() => navigate('/cadastros/recursos'), 1500);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">{id ? 'Editar Recurso' : 'Cadastro de Recurso'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <InformacoesPessoaisForm register={register} errors={errors} />
        <InformacoesContatoForm register={register} errors={errors} />
        <InformacoesContratoForm register={register} errors={errors} />
        <AnexosForm handleFileChange={handleFileChange} />

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/cadastros/recursos" className="btn-secondary">Voltar</Link>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Recurso'}
          </Button>
        </div>
        {statusMessage && <p className={`mt-4 text-center ${errorMessage ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p>}
        {errorMessage && <p className="mt-4 text-center text-red-600">{errorMessage}</p>}
      </form>
    </div>
  );
};

// --- Sub-componentes ---



const InformacoesPessoaisForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Informações Pessoais</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="flex flex-row items-center gap-2 col-span-12">
        <label htmlFor="nome_completo" className="text-sm font-medium flex-shrink-0">Nome Completo</label>
        <Input id="nome_completo" type="text" {...register('nome_completo')} />
        {errors.nome_completo && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.nome_completo.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="cpf" className="text-sm font-medium flex-shrink-0">CPF</label>
        <Input id="cpf" type="text" {...register('cpf')} />
        {errors.cpf && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.cpf.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="funcao" className="text-sm font-medium flex-shrink-0">Função</label>
        <Input id="funcao" type="text" {...register('funcao')} />
        {errors.funcao && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.funcao.message}</p>}
      </div>
    </div>
  </div>
);

const InformacoesContatoForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Informações de Contato</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="telefone" className="text-sm font-medium flex-shrink-0">Telefone</label>
        <Input id="telefone" type="text" {...register('telefone')} />
        {errors.telefone && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.telefone.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="email" className="text-sm font-medium flex-shrink-0">E-mail</label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.email.message}</p>}
      </div>
    </div>
  </div>
);

const InformacoesContratoForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Informações de Contrato</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="tipo_contrato" className="text-sm font-medium flex-shrink-0">Tipo de Contrato</label>
        <select id="tipo_contrato" {...register('tipo_contrato')} className="w-full p-2 border rounded-md text-sm">
          <option value="CLT">CLT</option>
          <option value="TERCEIRIZADO">Terceirizado</option>
        </select>
        {errors.tipo_contrato && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.tipo_contrato.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="custo_hora" className="text-sm font-medium flex-shrink-0">Custo/Hora (R$)</label>
        <Input id="custo_hora" type="number" step="0.01" {...register('custo_hora', { valueAsNumber: true })} />
        {errors.custo_hora && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.custo_hora.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="custo_diaria" className="text-sm font-medium flex-shrink-0">Custo/Diária (R$)</label>
        <Input id="custo_diaria" type="number" step="0.01" {...register('custo_diaria', { valueAsNumber: true })} />
        {errors.custo_diaria && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.custo_diaria.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="data_admissao" className="text-sm font-medium flex-shrink-0">Data de Admissão</label>
        <Input id="data_admissao" type="date" {...register('data_admissao')} />
        {errors.data_admissao && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.data_admissao.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="status" className="text-sm font-medium flex-shrink-0">Status</label>
        <select id="status" {...register('status')} className="w-full p-2 border rounded-md text-sm">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        {errors.status && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.status.message}</p>}
      </div>
    </div>
  </div>
);

const AnexosForm = ({ handleFileChange }) => (
    <div className="mb-6">
        <p className="form-section-title">Anexos</p>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            <div className="col-span-12">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Documentos</label>
                <input id="file-upload" name="file-upload" type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-light file:text-accent-dark hover:file:bg-accent/20" />
            </div>
        </div>
    </div>
);

export default RecursosForm;
