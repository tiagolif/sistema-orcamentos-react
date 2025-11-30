export const SYSTEM_DIAGNOSIS = `# Relatório Técnico de Diagnóstico - ERP System

## Visão Geral da Stack

*   **Linguagem/Framework:** O projeto é construído em **JavaScript** utilizando **React** e o ecossistema **Vite** como ferramenta de build. Não é um projeto Next.js.
*   **Dependências Principais (\`package.json\`):**
    *   \
`@supabase/supabase-js\
`: Cliente oficial para interação com o Supabase.
    *   \
`react\
`, \
`react-dom\
`: Biblioteca principal para a UI.
    *   \
`react-router-dom\
`: Gerenciamento de rotas no lado do cliente.
    *   \
`zustand\
`: Gerenciamento de estado global.
    *   \
`react-hook-form\
` / \
`zod\
`: Para construção e validação de formulários.
    *   \
`tailwindcss\
`, \
`@mui/material\
`: Para estilização da interface.
    *   \
`vite\
`: Ferramenta de build e desenvolvimento.

## Arquitetura de Autenticação (CRÍTICO)

A autenticação é gerenciada inteiramente no lado do cliente, combinando o cliente Supabase com o React Router.

1.  **Inicialização do Supabase:**
    *   O cliente Supabase é inicializado no arquivo \
`src/supabaseClient.js\
`.
    *   Ele utiliza as variáveis de ambiente \
`VITE_SUPABASE_URL\
` e \
`VITE_SUPABASE_ANON_KEY\
` através do objeto \
`import.meta.env\
`, que é o padrão do Vite.

    ```javascript
    // Em src/supabaseClient.js
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

2.  **Fluxo de Autenticação:**
    *   **Página de Login:** O código de login está em \
`src/pages/LoginPage.jsx\
`. Ele suporta autenticação por e-mail/senha (\
`signInWithPassword\
`) e OAuth com Google (\
`signInWithOAuth\
`).
    *   **Gerenciamento de Sessão:** O arquivo \
`src/App.jsx\
` é o ponto central do controle de sessão.
        *   Ele usa o listener \
`supabase.auth.onAuthStateChange\
` para detectar eventos de \
`SIGNED_IN\
` e \
`SIGNED_OUT\
`.
        *   O estado da sessão do usuário é mantido em um state do React (\
`session\
`).

3.  **Proteção de Rotas (Middleware):**
    *   Não há um arquivo de middleware (\
`middleware.ts\
`). A proteção de rotas é implementada diretamente no \
`src/App.jsx\
` usando \
`react-router-dom\
`.
    *   As rotas protegidas são aninhadas dentro de uma rota pai que verifica a existência da \
`session\
`. Se a sessão for nula, o usuário é redirecionado para \
`/login\
`.

    ```jsx
    // Em src/App.jsx
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/"
        element={session ? <MainLayout /> : <Navigate to="/login" />}
      >
        {/* Rotas protegidas aqui */}
        <Route index element={<Dashboard />} />
        ...
      </Route>
    </Routes>
    ```

## Variáveis de Ambiente

O sistema espera as seguintes variáveis de ambiente para se conectar ao Supabase. Elas devem ser configuradas nas "Environment Variables" do projeto na Vercel.

*   \
`VITE_SUPABASE_URL\
`: A URL do projeto Supabase.
*   \
`VITE_SUPABASE_ANON_KEY\
`: A chave anônima (public) do projeto Supabase.

**Observação:** Não foi encontrado o uso de uma \
`SUPABASE_SERVICE_ROLE_KEY\
`, indicando que todas as operações, incluindo as de banco de dados, provavelmente estão sendo feitas com a chave anônima do lado do cliente.

## Estrutura de Pastas (Resumida)

```
.
├── src/
│   ├── assets/         # Imagens e outros recursos estáticos
│   ├── components/     # Componentes React reutilizáveis
│   ├── context/        # Contextos React
│   ├── data/           # Dados estáticos ou mocks
│   ├── hooks/          # Hooks customizados (ex: useClients.js)
│   ├── layout/         # Componentes de layout (ex: MainLayout.jsx)
│   ├── pages/          # Componentes de página (ex: LoginPage.jsx, Dashboard.jsx)
│   ├── store/          # Lógica de estado (Zustand)
│   ├── App.jsx         # Componente raiz com o roteador
│   ├── main.jsx        # Ponto de entrada da aplicação
│   └── supabaseClient.js # Inicialização do cliente Supabase
├── package.json
├── vite.config.js
└── ...
```

## Interação com Banco de Dados

1.  **Padrão de Consulta:**
    *   As consultas ao banco de dados são feitas através de hooks customizados, como visto em \
`src/hooks/useClients.js\
`.
    *   O padrão utilizado é \
`supabase.from('nome_da_tabela').select(...)\
`.
    *   **Ponto Crítico:** As consultas no frontend **não** incluem filtros de usuário (ex: \
`.eq('user_id', user.id)\
`). A aplicação confia inteiramente nas políticas de Row Level Security (RLS) do Supabase para garantir que um usuário veja apenas seus próprios dados.

2.  **Estrutura das Tabelas (SQL):**
    *   Os arquivos \
`database_schema.sql\
`, \
`V2__...\
`, e \
`V3__...\
` definem a estrutura do banco.
    *   Tabelas principais incluem \
`insumos\
`, \
`composicoes\
`, \
`orcamentos\
`, e \
`clientes\
`.
    *   **Diagnóstico Crítico:** Nenhuma dessas tabelas de dados principais possui uma coluna que a relacione a um usuário (como \
`user_id\
` ou \
`created_by\
` fazendo referência a \
`auth.users\
`).

## Configurações de Deploy

*   Não há um arquivo \
`vercel.json\
`.
*   O arquivo \
`vite.config.js\
` possui uma configuração padrão para um projeto React, sem customizações que impactem o deploy ou a autenticação.

## Diagnóstico e Hipótese do Problema

O código de autenticação e gerenciamento de sessão no frontend está **correto e funcional**. O problema de acesso descrito ("só funciona para o dono, não para terceiros") é quase certamente um problema de **permissão no backend (Supabase)**.

**Hipótese Principal:**

1.  **Row Level Security (RLS):** O RLS está ativado por padrão em novas tabelas no Supabase.
2.  **Falta de Vínculo com Usuário:** As tabelas (\
`clientes\
`, \
`orcamentos\
`, etc.) não têm uma coluna \
`user_id\
` para identificar o "dono" de cada registro.
3.  **Bloqueio por Padrão:** Sem uma política de RLS que conceda acesso (uma \
`policy\
` \
`USING (auth.uid() = user_id)\
`), o Supabase bloqueia todas as tentativas de \
`SELECT\
`, \
`INSERT\
`, \
`UPDATE\
`, e \
`DELETE\
` para usuários autenticados.
4.  **Acesso do "Dono":** O "dono" do projeto provavelmente está usando a aplicação localmente ou em um ambiente de teste com a \
`SUPABASE_SERVICE_ROLE_KEY\
` (ou outra chave de superusuário), que **ignora as políticas de RLS**, dando a falsa impressão de que tudo funciona. Quando um usuário normal se cadastra e faz login na Vercel, ele usa a chave anônima e é bloqueado pelo RLS.

### Próximos Passos Recomendados

1.  **Alterar Tabelas:** Adicionar uma coluna \
`user_id\
` (do tipo \
`uuid\
`) a todas as tabelas que contêm dados que pertencem a um usuário.
2.  **Criar Políticas RLS:** Para cada tabela, criar uma política de RLS que permita o acesso apenas ao usuário correspondente. Exemplo para a tabela \
`clientes\
`:
    ```sql
    -- 1. Ativar RLS na tabela
    ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

    -- 2. Criar política para SELECT
    CREATE POLICY "Permitir que usuários leiam seus próprios clientes"
    ON public.clientes FOR SELECT
    USING (auth.uid() = user_id);

    -- 3. Criar política para INSERT
    CREATE POLICY "Permitir que usuários criem seus próprios clientes"
    ON public.clientes FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    ```
3.  **Atualizar Código:** Modificar as funções de \
`INSERT\
` no frontend para sempre incluir o \
`user_id\
` do usuário logado ao criar um novo registro.
`;
