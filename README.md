# Hidrosantec — Sistema de Gestão de Orçamentos e Obras

Aplicação web desenvolvida em **React** para apoiar orçamento, composição de custos e acompanhamento operacional de obras.

O projeto faz parte do meu portfólio de desenvolvimento e demonstra construção de interfaces de negócio, integração com backend-as-a-service, organização por módulos e uso de bibliotecas modernas do ecossistema React.

**Autor:** Tiago Cunha de Souza

> **Status:** projeto em evolução. Algumas áreas do sistema estão mais maduras que outras e determinados módulos permanecem experimentais.

---

## Visão do produto

A proposta é concentrar em uma única aplicação atividades que normalmente ficam distribuídas entre planilhas, documentos e sistemas separados.

O repositório inclui páginas e componentes relacionados a:

- dashboard;
- clientes;
- composições de custos;
- bases de preço;
- BDI;
- encargos sociais;
- apontamentos;
- diário de obras;
- compras;
- gestão operacional de obras.

A arquitetura foi pensada para crescer de forma modular, preservando separação entre páginas, componentes, contexto, estado e integração com dados.

---

## Stack

### Frontend

- React 19
- Vite 7
- React Router
- Material UI
- Emotion
- Tailwind CSS
- Lucide / Heroicons / React Icons

### Dados e estado

- Supabase
- Zustand
- React Hook Form
- Zod

### Visualização e recursos de negócio

- Chart.js / react-chartjs-2
- Leaflet / React Leaflet
- jsPDF / jsPDF AutoTable
- React Signature Canvas

### IA

O projeto possui dependências para experimentação com recursos de IA usando o AI SDK e integração com modelos Google. Recursos de IA devem ser tratados como funcionalidades em evolução, não como requisito para executar o núcleo da aplicação.

### Qualidade

- ESLint
- Vitest
- Testing Library
- Playwright

---

## Estrutura principal

```text
src/
├── components/    # componentes reutilizáveis
├── context/       # contextos React
├── data/          # dados e estruturas auxiliares
├── hooks/         # hooks customizados
├── layout/        # composição visual e navegação
├── lib/           # integrações e utilidades
├── pages/         # módulos/telas de negócio
├── store/         # estado compartilhado
├── App.jsx        # rotas e composição principal
└── supabaseClient.js
```

---

## Domínio de negócio

### Composição de Preço Unitário — CPU

Representa a decomposição de um serviço em insumos, mão de obra, equipamentos e demais componentes necessários para estimar seu custo.

### BDI

O sistema considera o conceito de **Benefícios e Despesas Indiretas**, utilizado para incorporar custos indiretos, riscos, tributos e margem na formação do preço.

### Bases de preço

A arquitetura prevê organização de referências de custos utilizadas na preparação de orçamentos. A utilização de bases oficiais deve respeitar licença, fonte, competência e região aplicáveis.

### Diário e apontamentos

O projeto também explora registro operacional de atividades de campo, permitindo aproximar planejamento e execução.

---

## Design

A interface segue o conceito interno de **“Prancheta Digital”**:

- alta densidade de informação sem sacrificar legibilidade;
- navegação orientada a tarefas;
- aparência profissional para contexto técnico;
- componentes reutilizáveis;
- foco em uso desktop e evolução para experiências responsivas.

---

## Executando localmente

### Pré-requisitos

- Node.js compatível com o Vite 7
- npm
- projeto Supabase, caso queira utilizar funcionalidades dependentes de backend

### Instalação

```bash
git clone https://github.com/tiagolif/sistema-orcamentos-react.git
cd sistema-orcamentos-react
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação.

---

## Scripts

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # visualiza o build
npm run lint     # análise estática
npm run test     # testes com Vitest
```

---

## Configuração do Supabase

O projeto utiliza `@supabase/supabase-js`.

Credenciais reais **não devem ser commitadas no repositório**. Em uma instalação própria, utilize variáveis de ambiente e políticas de acesso adequadas ao ambiente.

---

## O que este projeto demonstra no meu portfólio

- desenvolvimento de aplicações React voltadas a processos reais de negócio;
- modelagem de funcionalidades para orçamento e operações;
- organização de frontend por módulos;
- integração com Supabase;
- estado compartilhado e validação de formulários;
- geração de documentos/PDF;
- visualização de dados e mapas;
- experimentação com IA dentro de aplicações empresariais;
- evolução incremental de um produto com múltiplos módulos.

---

## Próximos passos

- consolidar documentação de banco de dados;
- ampliar cobertura de testes;
- documentar fluxos principais com screenshots;
- revisar responsividade dos módulos;
- documentar módulos de IA separadamente;
- estabelecer releases e changelog.

---

## Observação

Este repositório é apresentado como **projeto de portfólio e desenvolvimento contínuo**. A presença de um módulo, dependência ou tela no código não implica que toda funcionalidade esteja finalizada ou pronta para uso em produção.
