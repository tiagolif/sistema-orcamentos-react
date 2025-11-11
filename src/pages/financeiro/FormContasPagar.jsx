import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../supabaseClient';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  valor: z.number().positive('O valor deve ser positivo.'),
  data_vencimento: z.string().min(1, 'A data de vencimento é obrigatória.'),
  fornecedor_id: z.string().optional().or(z.literal('')),
  obra_id: z.string().optional().or(z.literal('')),
  status: z.string(),
});

const FormContasPagar = ({ isOpen, onClose, onSaveSuccess }) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [obras, setObras] = useState([]);
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'A PAGAR',
    },
  });

  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data } = await supabase.from('suppliers').select('id, nome_completo, razao_social, tipo_pessoa');
      setFornecedores(data);
    };
    const fetchObras = async () => {
      const { data } = await supabase.from('obras').select('id, nome_obra');
      setObras(data);
    };
    fetchFornecedores();
    fetchObras();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setStatusMessage('Salvando...');
    setErrorMessage('');

    const submissionData = { ...data, tipo: 'DESPESA' };
    // Ensure optional IDs are null if empty string
    submissionData.fornecedor_id = submissionData.fornecedor_id || null;
    submissionData.obra_id = submissionData.obra_id || null;

    const { data: savedEntry, error: submissionError } = await supabase
      .from('lancamentos_financeiros')
      .insert(submissionData)
      .select()
      .single();

    if (submissionError) {
      setErrorMessage(`Erro ao salvar lançamento: ${submissionError.message}`);
      setStatusMessage('');
      console.error('Error inserting data:', submissionError);
      return;
    }

    if (files.length > 0) {
      setStatusMessage('Salvando anexos...');
      for (const file of files) {
        const { error: uploadError } = await supabase.storage
          .from('documentos_lancamentos')
          .upload(`${savedEntry.id}/${file.name}`, file, {
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

    setStatusMessage('Lançamento salvo com sucesso!');
    onSaveSuccess();
    reset(); // Reset form after successful submission
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Lançamento a Pagar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Descrição" id="descricao" error={errors.descricao}>
          <Input id="descricao" type="text" {...register('descricao')} />
        </FormField>
        <FormField label="Valor" id="valor" error={errors.valor}>
          <Input id="valor" type="number" step="0.01" {...register('valor', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Data de Vencimento" id="data_vencimento" error={errors.data_vencimento}>
          <Input id="data_vencimento" type="date" {...register('data_vencimento')} />
        </FormField>
        <FormField label="Fornecedor" id="fornecedor_id">
          <select id="fornecedor_id" {...register('fornecedor_id')} className="w-full p-2 border rounded-md text-sm">
            <option value="">Selecione um fornecedor</option>
            {fornecedores?.map((f) => (
              <option key={f.id} value={f.id}>{f.razao_social || f.nome_completo}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Obra (Rateio)" id="obra_id">
          <select id="obra_id" {...register('obra_id')} className="w-full p-2 border rounded-md text-sm">
            <option value="">Selecione uma obra</option>
            {obras?.map((o) => (
              <option key={o.id} value={o.id}>{o.nome_obra}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Status" id="status">
          <select id="status" {...register('status')} className="w-full p-2 border rounded-md text-sm">
            <option value="A PAGAR">A Pagar</option>
            <option value="PAGO">Pago</option>
          </select>
        </FormField>

        <AnexosForm handleFileChange={handleFileChange} />

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
        {statusMessage && <p className={`mt-2 text-center ${errorMessage ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p>}
        {errorMessage && <p className="mt-2 text-center text-red-600">{errorMessage}</p>}
      </form>
    </Modal>
  );
};

// --- Sub-componentes ---
const FormField = ({ label, id, error, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
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

export default FormContasPagar;
