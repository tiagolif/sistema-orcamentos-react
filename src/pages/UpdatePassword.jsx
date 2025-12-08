import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage(`Erro ao atualizar a senha: ${error.message}`);
    } else {
      alert('Senha atualizada com sucesso!');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          Definir Nova Senha
        </h2>
        <form onSubmit={handlePasswordUpdate}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="new-password" style={{ display: 'block', marginBottom: '8px' }}>
              Nova Senha
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #d1d5db'
              }}
              placeholder="Digite sua nova senha"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Senha'}
          </button>
          {message && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '16px' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
