import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Button from '../ui/Button';
import Input from '../ui/Input';

const NovaBaseModal = ({ isOpen, onClose, onSave }) => {
  const [nomeBase, setNomeBase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!nomeBase.trim()) {
      setError('O nome da base é obrigatório.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('bases_de_preco')
      .insert([{ nome: nomeBase }])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      console.error('Erro ao salvar nova base:', insertError);
      setError('Não foi possível salvar a base. Tente novamente.');
    } else {
      onSave(data); // Passa a nova base de volta para o componente pai
      handleClose();
    }
  };

  const handleClose = () => {
    setNomeBase('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Criar Nova Base Própria</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="nome_base" className="block text-sm font-medium mb-1">Nome da Base</label>
            <Input
              id="nome_base"
              type="text"
              value={nomeBase}
              onChange={(e) => setNomeBase(e.target.value)}
              placeholder="Ex: Base Própria 2025"
              className="w-full"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovaBaseModal;
