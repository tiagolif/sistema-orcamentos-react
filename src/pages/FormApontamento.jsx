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
const apontamentoSchema = z.object({
  recurso_id: z.string().min(1, 'O recurso é obrigatório.'),
  obra_id: z.string().optional().or(z.literal('')),
  data_apontamento: z.string().min(1, 'A data do apontamento é obrigatória.'),
  horas_trabalhadas: z.number().optional().or(z.literal(0)),
  diaria_trabalhada: z.number().optional().or(z.literal(0)),
  descricao_servico: z.string().optional().or(z.literal('')),
  tipo_hora: z.string().optional(),
  classificacao_custo: z.string().optional(),
  status_apontamento: z.string().optional(),
}).refine(data => data.horas_trabalhadas > 0 || data.diaria_trabalhada > 0, {
  message: 'Informe as horas ou a diária trabalhada.',
  path: ['horas_trabalhadas'], // Attach error to one of the fields
});

// --- Componente Principal ---
const FormApontamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [obras, setObras] = useState([]);
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(apontamentoSchema),
    defaultValues: {
      horas_trabalhadas: 0,
      diaria_trabalhada: 0,
      tipo_hora: 'Normal',
      classificacao_custo: 'Produtivo',
      status_apontamento: 'Pendente',
    },
  });

  useEffect(() => {
    const fetchDependencies = async () => {
      // Fetch Recursos
      const { data: recursosData, error: recursosError } = await supabase
        .from('recursos_humanos')
        .select('id, nome_completo, funcao');
      if (recursosError) {
        console.error('Error fetching recursos:', recursosError);
      } else {
        setRecursos(recursosData);
      }

      // Fetch Obras
      const { data: obrasData, error: obrasError } = await supabase
        .from('obras')
        .select('id, nome_obra');
      if (obrasError) {
        console.error('Error fetching obras:', obrasError);
      } else {
        setObras(obrasData);
      }
    };
    fetchDependencies();
  }, []);

  useEffect(() => {
    const fetchApontamento = async () => {
      if (!id) {
        reset({ horas_trabalhadas: 0, diaria_trabalhada: 0, tipo_hora: 'Normal', classificacao_custo: 'Produtivo', status_apontamento: 'Pendente' });
        return;
      }
      const { data, error } = await supabase
        .from('apontamentos_mo')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erro ao carregar apontamento: ${error.message}`);
      } else if (data) {
        reset(data);
      }
    };
    fetchApontamento();
  }, [id, reset]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setStatusMessage('Salvando...');
    setErrorMessage('');

    const submissionData = { ...data };
    // Convert empty date strings to null for Supabase
    submissionData.data_apontamento = submissionData.data_apontamento || null;
    // Ensure optional IDs are null if empty string
    submissionData.recurso_id = submissionData.recurso_id || null;
    submissionData.obra_id = submissionData.obra_id || null;
    // Convert 0 to null for optional numeric fields if they are not used
    submissionData.horas_trabalhadas = submissionData.horas_trabalhadas === 0 ? null : submissionData.horas_trabalhadas;
    submissionData.diaria_trabalhada = submissionData.diaria_trabalhada === 0 ? null : submissionData.diaria_trabalhada;

    const { data: savedApontamento, error: submissionError } = id
      ? await supabase.from('apontamentos_mo').update(submissionData).eq('id', id).select().single()
      : await supabase.from('apontamentos_mo').insert(submissionData).select().single();

    if (submissionError) {
      setErrorMessage(`Erro ao salvar apontamento: ${submissionError.message}`);
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
        const caminho = `${savedApontamento.id}/${newFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documentos_apontamentos')
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

    setStatusMessage('Apontamento salvo com sucesso!');
    setTimeout(() => navigate('/apontamentos'), 1500);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-lg mt-0 mb-6 text-center">{id ? 'Editar Apontamento' : 'Novo Apontamento'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <LancamentoForm register={register} errors={errors} recursos={recursos} obras={obras} />
        <DetalhesServicoForm register={register} errors={errors} />
        <AnexosForm handleFileChange={handleFileChange} />

        <div className="flex justify-end gap-4 mt-6">
          <Link to="/apontamentos" className="btn-secondary">Voltar</Link>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Apontamento'}
          </Button>
        </div>
        {statusMessage && <p className={`mt-4 text-center ${errorMessage ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p>}
        {errorMessage && <p className="mt-4 text-center text-red-600">{errorMessage}</p>}
      </form>
    </div>
  );
};

// --- Sub-componentes ---



const LancamentoForm = ({ register, errors, recursos, obras }) => (
  <div className="mb-6">
    <p className="form-section-title">Lançamento</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="recurso_id" className="text-sm font-medium flex-shrink-0">Recurso</label>
        <select id="recurso_id" {...register('recurso_id')} className="w-full p-2 border rounded-md text-sm">
          <option value="">Selecione um recurso</option>
          {recursos.map((r) => (
            <option key={r.id} value={r.id}>{r.nome_completo} ({r.funcao})</option>
          ))}
        </select>
        {errors.recurso_id && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.recurso_id.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="obra_id" className="text-sm font-medium flex-shrink-0">Obra</label>
        <select id="obra_id" {...register('obra_id')} className="w-full p-2 border rounded-md text-sm">
          <option value="">Selecione uma obra</option>
          {obras.map((o) => (
            <option key={o.id} value={o.id}>{o.nome_obra}</option>
          ))}
        </select>
        {errors.obra_id && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.obra_id.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="data_apontamento" className="text-sm font-medium flex-shrink-0">Data</label>
        <Input id="data_apontamento" type="date" {...register('data_apontamento')} />
        {errors.data_apontamento && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.data_apontamento.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="tipo_hora" className="text-sm font-medium flex-shrink-0">Tipo de Hora</label>
        <select id="tipo_hora" {...register('tipo_hora')} className="w-full p-2 border rounded-md text-sm">
          <option value="Normal">Normal</option>
          <option value="Extra 50%">Extra 50%</option>
          <option value="Extra 100%">Extra 100%</option>
        </select>
        {errors.tipo_hora && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.tipo_hora.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-4">
        <label htmlFor="status_apontamento" className="text-sm font-medium flex-shrink-0">Status</label>
        <select id="status_apontamento" {...register('status_apontamento')} className="w-full p-2 border rounded-md text-sm">
          <option value="Pendente">Pendente</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Rejeitado">Rejeitado</option>
        </select>
        {errors.status_apontamento && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.status_apontamento.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="horas_trabalhadas" className="text-sm font-medium flex-shrink-0">Horas Trabalhadas</label>
        <Input id="horas_trabalhadas" type="number" step="0.01" {...register('horas_trabalhadas', { valueAsNumber: true })} />
        {errors.horas_trabalhadas && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.horas_trabalhadas.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="diaria_trabalhada" className="text-sm font-medium flex-shrink-0">Diária Trabalhada</label>
        <Input id="diaria_trabalhada" type="number" step="0.01" {...register('diaria_trabalhada', { valueAsNumber: true })} />
        {errors.diaria_trabalhada && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.diaria_trabalhada.message}</p>}
      </div>
    </div>
  </div>
);

const DetalhesServicoForm = ({ register, errors }) => (
  <div className="mb-6">
    <p className="form-section-title">Detalhes do Serviço</p>
    <div className="grid grid-cols-12 gap-x-4 gap-y-2">
      <div className="flex flex-row items-center gap-2 col-span-12">
        <label htmlFor="descricao_servico" className="text-sm font-medium flex-shrink-0">Descrição do Serviço</label>
        <Input as="textarea" id="descricao_servico" {...register('descricao_servico')} className="min-h-20 resize-y" />
        {errors.descricao_servico && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.descricao_servico.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="classificacao_custo" className="text-sm font-medium flex-shrink-0">Classificação do Custo</label>
        <select id="classificacao_custo" {...register('classificacao_custo')} className="w-full p-2 border rounded-md text-sm">
          <option value="Produtivo">Produtivo</option>
          <option value="Improdutivo">Improdutivo</option>
        </select>
        {errors.classificacao_custo && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.classificacao_custo.message}</p>}
      </div>
      <div className="flex flex-row items-center gap-2 col-span-6">
        <label htmlFor="status_apontamento" className="text-sm font-medium flex-shrink-0">Status do Apontamento</label>
        <select id="status_apontamento" {...register('status_apontamento')} className="w-full p-2 border rounded-md text-sm">
          <option value="Pendente">Pendente</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Rejeitado">Rejeitado</option>
        </select>
        {errors.status_apontamento && <p className="text-red-500 text-xs mt-1 col-span-12">{errors.status_apontamento.message}</p>}
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

export default FormApontamento;
