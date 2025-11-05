import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';

const insumoSchema = z.object({
  codigo_item: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  custo_unitario: z.preprocess((val) => parseFloat(String(val).replace(',', '.')), z.number().min(0, 'Custo deve ser positivo')),
  tipo_insumo: z.string().min(1, 'Tipo de insumo é obrigatório'),
  data_preco: z.string().min(1, 'Data do preço é obrigatória'),
  fonte_preco: z.string().optional(),
  estado: z.string().optional(),
  desonerado: z.boolean().optional(),
});

const tipoInsumoOptions = ['MAT', 'MO', 'EQUIP', 'SERV', 'TRANSP', 'OUTROS'];

const InsumoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
        desonerado: true, // Valor padrão para o checkbox
        tipo_insumo: 'MAT', // Valor padrão para o select
    }
  });

  useEffect(() => {
    if (id) {
      const fetchInsumo = async () => {
        const { data, error } = await supabase
          .from('insumos')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          console.error('Erro ao buscar insumo:', error);
        } else {
          // Formata a data para o formato YYYY-MM-DD esperado pelo input type="date"
          if (data.data_preco) {
            data.data_preco = new Date(data.data_preco).toISOString().split('T')[0];
          }
          reset(data);
        }
      };
      fetchInsumo();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from('insumos')
      .upsert(id ? { ...data, id } : data);

    if (error) {
      console.error('Erro ao salvar insumo:', error);
      alert(`Erro: ${error.message}`);
    } else {
      alert('Insumo salvo com sucesso!');
      navigate('/insumos');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Editar Insumo' : 'Novo Insumo'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input id="codigo_item" label="Código do Item" {...register('codigo_item')} error={errors.codigo_item} />
        <Input id="descricao" label="Descrição" {...register('descricao')} error={errors.descricao} className="md:col-span-2" />
        <Input id="unidade" label="Unidade" {...register('unidade')} error={errors.unidade} />
        
        <div className="flex flex-col gap-1">
            <label htmlFor="tipo_insumo" className="text-sm font-medium mb-1">Tipo de Insumo</label>
            <select id="tipo_insumo" {...register('tipo_insumo')} className="p-2 border rounded">
                {tipoInsumoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {errors.tipo_insumo && <p className="text-red-500 text-xs mt-1">{errors.tipo_insumo.message}</p>}
        </div>

        <Input id="custo_unitario" label="Custo Unitário (R$)" type="number" step="0.01" {...register('custo_unitario')} error={errors.custo_unitario} />
        <Input id="data_preco" label="Data do Preço" type="date" {...register('data_preco')} error={errors.data_preco} />
        <Input id="fonte_preco" label="Fonte do Preço" {...register('fonte_preco')} error={errors.fonte_preco} placeholder="Ex: Base Própria, SINAPI"/>
        <Input id="estado" label="Estado (UF)" {...register('estado')} error={errors.estado} />
        
        <div className="flex items-center gap-2 md:col-span-3">
            <input id="desonerado" type="checkbox" {...register('desonerado')} className="h-4 w-4"/>
            <label htmlFor="desonerado">Desonerado</label>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="secondary" onClick={() => navigate('/insumos')}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </form>
  );
};

export default InsumoForm;
