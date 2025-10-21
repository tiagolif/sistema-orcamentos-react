# Hidrosantec - Sistema de Gestão de Orçamentos

Este projeto é um sistema de gestão de orçamentos de obras, desenvolvido com o objetivo de ser uma ferramenta moderna, eficiente e intuitiva, inspirada nas melhores práticas de softwares como o OrçaFácil.

## ✨ Filosofia de Design: Prancheta Digital Serena

A interface do sistema segue um Design System próprio, focado em clareza, profissionalismo e densidade de informação.

- **Conceito**: A interface deve ser limpa, profissional, compacta e organizada, evocando a sensação de uma "prancheta de arquiteto digital".
- **Paleta de Cores**:
  - **Primária (Ações)**: Verde Esmeralda
  - **Navegação Principal**: Cinza Ardósia Escuro
  - **Fundo**: Branco Gelo
- **Escala**: O sistema utiliza uma escala compacta, com fontes e espaçamentos otimizados para alta densidade de informação.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19
- **Ambiente de Desenvolvimento**: Vite
- **Roteamento**: React Router
- **Backend (BaaS)**: Supabase

## 🚀 Como Executar o Projeto

1.  **Instale as dependências:**
    ```sh
    npm install
    ```

2.  **Execute o ambiente de desenvolvimento:**
    ```sh
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou em outra porta, se a 5173 estiver em uso).

## 🎯 Conceitos Chave do Negócio

O sistema é construído sobre conceitos fundamentais da engenharia de custos e orçamentação de obras:

- **Composição de Preço Unitário (CPU)**: Detalhamento dos insumos, mão de obra e equipamentos necessários para executar um serviço.
- **BDI (Benefícios e Despesas Indiretas)**: Taxa aplicada sobre o custo direto para cobrir despesas indiretas e obter o lucro.
- **Bases de Custo**: Integração com bases de referência como a SINAPI.