import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/background-login.jpg')" }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Criar Conta</h2>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-600">Conta criada com sucesso!</p>
            <p className="text-gray-600">Verifique seu e-mail para confirmar sua conta.</p>
            <Link to="/login" className="mt-4 inline-block font-medium text-indigo-600 hover:text-indigo-500">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Criar Conta
              </button>
            </div>
          </form>
        )}

        <div className="text-sm text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
