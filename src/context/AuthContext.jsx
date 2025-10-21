import React, { createContext, useContext } from 'react';

// 1. Criar um contexto com um valor padrão que simula um usuário logado.
const AuthContext = createContext({
  user: { email: 'developer@example.com' }, // Usuário de desenvolvimento
  isAuthenticated: true,
  logout: () => {},
});

// 2. Criar um provedor que simplesmente renderiza os componentes filhos, sem lógica de carregamento ou autenticação.
export const AuthProvider = ({ children }) => {
  const value = {
    user: { email: 'developer@example.com' },
    isAuthenticated: true,
    logout: () => {}, // console.log('Logout desativado no modo de desenvolvimento.'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Exportar o hook customizado para consumir o contexto, como antes.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
