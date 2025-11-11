import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../supabaseClient';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  obra_id: z.string().min(1, 'A obra é obrigatória.'),
  mes_referencia: z.string().min(1, 'O mês de referência é obrigatório.'),
  numero_boletim: z.string().optional(),
});

const FormNovoBoletim = ({ isOpen, onClose }) => {
  const [obras, setObras] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchObras = async () => {
      const { data } = await supabase.from('obras').select('id, nome_obra');
      setObras(data);
    };
    fetchObras();
  }, []);

  const onSubmit = async (data) => {
    const { data: newBoletim, error } = await supabase
      .from('medicoes_boletins')
      .insert([
        { ...data, status: 'Em Aberto' },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      onClose();
      navigate(`/medicoes/boletim/${newBoletim.id}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Boletim de Medição">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Obra</label>
          <select {...register('obra_id')} className="w-full p-2 border rounded">
            <option value="">Selecione uma obra</option>
            {obras?.map((o) => (
              <option key={o.id} value={o.id}>{o.nome_obra}</option>
            ))}
          </select>
          {errors.obra_id && <p className="text-red-500 text-sm">{errors.obra_id.message}</p>}
        </div>
        <Input label="Mês de Referência" type="date" {...register('mes_referencia')} error={errors.mes_referencia} />
        <Input label="Número do Boletim" {...register('numero_boletim')} error={errors.numero_boletim} />
        <Button type="submit" variant="primary">Salvar e Avançar</Button>
      </form>
    </Modal>
  );
};

export default FormNovoBoletim;
