import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // O listener onAuthStateChange em App.jsx cuidará do redirecionamento
      console.log('Login successful, waiting for redirect...');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/images/background-login.jpg')" }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Bem-vindo!</h2>
        <p className="text-center text-gray-600">Faça login para continuar</p>
        
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
              autoComplete="current-password"
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
              Entrar
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continue com</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8S111.8 11.6 244 11.6C381.5 11.6 488 120.3 488 261.8zm-252.2-114.5c-49.2 0-89.3 39.8-89.3 89.3s39.8 89.3 89.3 89.3 89.3-39.8 89.3-89.3-39.8-89.3-89.3-89.3zm244.3-22.3c-10.8-10.8-24.3-16.2-40.8-16.2-34.2 0-63.8 28.3-63.8 63.8s29.5 63.8 63.8 63.8c16.5 0 30-5.4 40.8-16.2l-26.8-26.8c-5.4 5.4-12.8 8.1-21.5 8.1-15.2 0-27.8-12.5-27.8-27.8s12.5-27.8 27.8-27.8c8.7 0 16.2 2.7 21.5 8.1l26.8-26.8z"></path></svg>
            Entrar com Google
          </button>
        </div>

        <div className="text-sm text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Crie uma agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
