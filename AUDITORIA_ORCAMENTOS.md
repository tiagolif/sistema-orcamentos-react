# Relatório de Auditoria Técnica - Módulo de Orçamentos

Este documento detalha a arquitetura e o fluxo de dados do atual módulo de Orçamentos, com o objetivo de planejar futuras expansões de forma segura.

## 1. Fluxo de Criação de Orçamento

O processo de criação de um novo orçamento é gerenciado por um Wizard de 3 passos, localizado em `src/components/orcamentos/OrcamentoWizard.jsx`.

*   **Passo 1: Informações Gerais**
    *   Coleta de dados básicos como `código`, `descrição`, `cliente`, `obra` e `categoria`.
    *   Possui uma seção condicional para dados de **Licitação**, que é ativada por um toggle switch.

*   **Passo 2: Encargos e BDI**
    *   O usuário define as opções de **arredondamento** para os cálculos.
    *   Define o tipo de **Encargos Sociais** (Desonerado / Não desonerado).
    *   **Cálculo do BDI:** O BDI é uma etapa obrigatória do fluxo. O usuário pode optar por:
        *   **Selecionar um BDI existente:** Uma lista de valores pré-definidos (ex: "BDI Obra Privada - 25.0%").
        *   **Informar BDI manualmente:** Abre campos para o usuário inserir as porcentagens de `Lucro`, `Despesas Fixas` e `Impostos`.

*   **Passo 3: Bases de Custo**
    *   O usuário seleciona e habilita as bases de custo que serão utilizadas no orçamento, como `SINAPI`, `SBC` e `SICRO`.

Após a finalização do Wizard, o sistema salva os metadados do orçamento e redireciona o usuário para a página de detalhamento (`/orcamento/:id`), onde os itens são efetivamente adicionados.

## 2. Integração SINAPI

A busca e adição de itens da base SINAPI não ocorre no Wizard, mas sim na página de detalhe do orçamento, provavelmente em `src/pages/PaginaOrcamento.jsx`.

*   **Busca de Dados:** O sistema busca os dados das tabelas `composicoes` e `insumos` (nomes inferidos) do banco de dados. A lógica para pesquisar e selecionar um item está contida em componentes como `ItemSearchRow.jsx`.

*   **Adição de Itens:** A adição de um item ao orçamento é gerenciada pelo Zustand, através da store `orcamentoStore.jsx`.
    *   A função `atualizarItemBusca` é chamada quando uma composição da SINAPI é selecionada.
    *   Ela adiciona um novo item do tipo `COMPOSICAO` ao estado `itens` da store, contendo todos os dados relevantes (código, descrição, unidade, valor, etc.).

## 3. Estrutura de Dados (Schema Inferido)

A análise do código, especialmente de `OrcamentoWizard.jsx` e `orcamentoStore.jsx`, sugere a seguinte estrutura de tabelas no Supabase:

*   **`orcamentos`**: Tabela principal que armazena os metadados de cada orçamento.
    *   **Colunas prováveis:** `id`, `codigo`, `descricao`, `cliente_id` (FK para `clientes`), `obra_id` (FK para `obras`), `categoria`, `bdi_rate`, `encargos_sociais`, `status`, etc.

*   **`orcamento_itens`**: Tabela que armazena os itens vinculados a um orçamento.
    *   **Colunas prováveis:** `id`, `orcamento_id` (FK para `orcamentos`), `parent_id` (para criar hierarquia de Etapas), `tipo_item` (string, ex: 'ETAPA', 'COMPOSICAO'), `item_id` (FK para `composicoes`), `quantidade`, `preco_unitario_congelado`.

*   **`orcamento_itens_detalhados`**: É uma **VIEW** do banco de dados, e não uma tabela. Ela é usada para *ler* os itens de forma detalhada, provavelmente fazendo um `JOIN` entre `orcamento_itens` e `composicoes` para buscar informações completas de cada item.

*   **`composicoes` e `insumos`**: Tabelas que armazenam os dados brutos da base SINAPI, utilizadas para consulta e adição ao orçamento.

*   **`clientes` e `obras`**: Tabelas de cadastro geral, vinculadas ao orçamento.

## 4. Componentes Críticos

Os arquivos mais importantes para o funcionamento do módulo são:

*   **`src/components/orcamentos/OrcamentoWizard.jsx`**: Responsável pelo wizard de criação e edição dos dados principais do orçamento.
*   **`src/pages/OrcamentosPage.jsx`**: Tela principal que lista todos os orçamentos criados.
*   **`src/pages/PaginaOrcamento.jsx`**: Tela de detalhamento onde o usuário efetivamente monta o orçamento, adicionando e editando etapas e composições. É o coração da funcionalidade.
*   **`src/store/orcamentoStore.jsx`**: Store Zustand que gerencia o estado do orçamento ativo (itens, totais) e lida com a persistência dos dados no banco de dados através das funções `fetchOrcamento` e `salvarOrcamentoEItens`.
*   **`src/components/orcamentos/TabelaOrcamento.jsx`**: Componente que renderiza a lista de itens do orçamento na `PaginaOrcamento.jsx`.
*   **`src/components/orcamentos/ItemSearchRow.jsx`**: Componente utilizado para buscar e selecionar novas composições para adicionar ao orçamento.
