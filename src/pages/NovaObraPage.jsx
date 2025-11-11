import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import custom UI components
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// --- Zod Schema ---
const obraSchema = z.object({
  cliente_id: z.string().min(1, 'O cliente é obrigatório.'),
  nome_obra: z.string().min(1, 'O nome da obra é obrigatório.'),
  status_obra: z.string().optional(),
  responsavel_tecnico: z.string().optional().or(z.literal('')),
  centro_de_custo: z.string().optional().or(z.literal('')),
  endereco: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  estado: z.string().optional().or(z.literal('')),
  cep: z.string().optional().or(z.literal('')),
  data_inicio: z.string().optional().or(z.literal('')),
  data_fim: z.string().optional().or(z.literal('')),
});

// --- Componente Principal ---
const NovaObraPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
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
    resolver: zodResolver(obraSchema),
    defaultValues: {
      status_obra: 'Em Planejamento',
    },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('id, nome_completo, razao_social');
      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClientes(data);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchObra = async () => {
      if (!id) {
        reset({ status_obra: 'Em Planejamento' });
        return;
      }
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erro ao carregar obra: ${error.message}`);
      } else if (data) {
        reset(data);
      }
    };
    fetchObra();
  }, [id, reset]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setStatus('Salvando...');
    setError('');

    const submissionData = { ...data };
    // Convert empty date strings to null for Supabase
    submissionData.data_inicio = submissionData.data_inicio || null;
    submissionData.data_fim = submissionData.data_fim || null;

    const { data: savedObra, error: submissionError } = id
      ? await supabase.from('obras').update(submissionData).eq('id', id).select().single()
      : await supabase.from('obras').insert(submissionData).select().single();

    if (submissionError) {
      setError(`Erro ao salvar obra: ${submissionError.message}`);
      setStatus('');
      return;
    }

    if (files.length > 0) {
      setStatus('Salvando anexos...');
      for (const file of files) {
        const { error: uploadError } = await supabase.storage
          .from('documentos_obras')
          .upload(`${savedObra.id}/${file.name}`, file, {
            upsert: true,
          });
        if (uploadError) {
          setError(`Erro no upload do anexo ${file.name}: ${uploadError.message}`);
          return;
        }
      }
    }

    setStatus('Obra salva com sucesso!');
    setTimeout(() => navigate('/cadastros/obras'), 1500);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">{id ? 'Editar Obra' : 'Cadastro de Obra'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <InformacoesPrincipaisForm register={register} errors={errors} clientes={clientes} />
        <GestaoPrazosForm register={register} errors={errors} />
        <EnderecoObraForm register={register} errors={errors} />
        <AnexosForm handleFileChange={handleFileChange} />

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/cadastros/obras" className="btn-secondary">Voltar</Link>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Obra'}
          </Button>
        </div>
        {status && <p className={`mt-4 text-center ${error ? 'text-red-600' : 'text-green-600'}`}>{status || error}</p>}
      </form>
    </div>
  );
};

// --- Sub-componentes ---

const FormField = ({ label, id, span, error, children }) => (
    <div className={`col-span-12 md:col-span-${span}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

const InformacoesPrincipaisForm = ({ register, errors, clientes }) => (
  <div className="mb-6">
    <p className="form-section-title">Informações Principais</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <FormField label="Cliente" id="cliente_id" span={6} error={errors.cliente_id}>
        <select id="cliente_id" {...register('cliente_id')} className="w-full p-2 border rounded-md text-sm">
          <option value="">Selecione um cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.razao_social || c.nome_completo}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Nome da Obra" id="nome_obra" span={6} error={errors.nome_obra}>
        <Input id="nome_obra" type="text" {...register('nome_obra')} />
      </FormField>
      <FormField label="Status da Obra" id="status_obra" span={6}>
        <select id="status_obra" {...register('status_obra')} className="w-full p-2 border rounded-md text-sm">
          <option value="Em Planejamento">Em Planejamento</option>
          <option value="Em Execução">Em Execução</option>
          <option value="Concluída">Concluída</option>
        </select>
      </FormField>
    </div>
  </div>
);

const GestaoPrazosForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Gestão e Prazos</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <FormField label="Responsável Técnico" id="responsavel_tecnico" span={6}>
        <Input id="responsavel_tecnico" type="text" {...register('responsavel_tecnico')} />
      </FormField>
      <FormField label="Centro de Custo" id="centro_de_custo" span={6}>
        <Input id="centro_de_custo" type="text" {...register('centro_de_custo')} />
      </FormField>
      <FormField label="Data de Início" id="data_inicio" span={6}>
        <Input id="data_inicio" type="date" {...register('data_inicio')} />
      </FormField>
      <FormField label="Data de Fim" id="data_fim" span={6}>
        <Input id="data_fim" type="date" {...register('data_fim')} />
      </FormField>
    </div>
  </div>
);

const EnderecoObraForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Endereço da Obra</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <FormField label="CEP" id="cep" span={3}>
        <Input id="cep" type="text" {...register('cep')} />
      </FormField>
      <FormField label="Endereço" id="endereco" span={9}>
        <Input id="endereco" type="text" {...register('endereco')} />
      </FormField>
      <FormField label="Cidade" id="cidade" span={9}>
        <Input id="cidade" type="text" {...register('cidade')} />
      </FormField>
      <FormField label="Estado" id="estado" span={3}>
        <Input id="estado" type="text" {...register('estado')} />
      </FormField>
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

export default NovaObraPage;
