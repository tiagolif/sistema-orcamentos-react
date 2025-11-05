import { test, expect } from '@playwright/test';

const NOME_CLIENTE_TESTE = `Cliente E2E ${Date.now()}`;
const NOME_ORCAMENTO_TESTE = 'Orçamento de Teste E2E';

test('Fluxo Principal: Criar Cliente, Orçamento, Etapa e Composição', async ({ page }) => {
  // Adiciona um listener para capturar e exibir erros do console do navegador
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`ERRO NO CONSOLE DO NAVEGADOR: ${msg.text()}`);
    }
  });

  // --- ETAPA 1: CRIAR UM NOVO CLIENTE ---
  await page.goto('http://localhost:5173/#/clientes/novo');
  await expect(page.locator('h2:has-text("Cadastro de Clientes")')).toBeVisible();

  await page.getByLabel('Nome Completo').fill(NOME_CLIENTE_TESTE);
  await page.getByLabel('CPF').fill('123.456.789-00');
  await page.getByRole('button', { name: 'Salvar Cliente' }).click();
  
  // Aguarda o retorno para a lista de clientes e verifica se o novo cliente está lá
  await page.waitForURL('**/#/clientes');
  await expect(page.getByText(NOME_CLIENTE_TESTE)).toBeVisible();


  // --- ETAPA 2: CRIAR UM NOVO ORÇAMENTO ---
  await page.goto('http://localhost:5173/#/orcamentos/novo');
  await expect(page.locator('h2:has-text("Passo 1: Informações Gerais")')).toBeVisible();

  // Preenche a descrição e seleciona o cliente recém-criado
  await page.getByPlaceholder('Ex: Construção de muro residencial').fill(NOME_ORCAMENTO_TESTE);
  await page.getByLabel('Cliente').selectOption({ label: NOME_CLIENTE_TESTE });
  
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.getByRole('button', { name: 'Próximo' }).click();

  // Salva e aguarda a navegação para a página do novo orçamento
  await page.getByRole('button', { name: 'Finalizar e Salvar' }).click();
  await page.waitForURL(/\/orcamento\/\d+/);
  await expect(page.locator(`h2:has-text("${NOME_ORCAMENTO_TESTE}")`)).toBeVisible();


  // --- ETAPA 3: ADICIONAR UMA ETAPA ---
  const nomeDaEtapa = `Etapa de Teste ${Date.now()}`;
  await page.getByText('Etapa', { exact: true }).locator('..').click();
  await page.getByPlaceholder('Digite a descrição da nova etapa').fill(nomeDaEtapa);

  const refetchPromiseEtapa = page.waitForResponse(/\/rest\/v1\/orcamento_itens_detalhados/);
  await page.getByRole('button', { name: 'Salvar' }).click();
  await refetchPromiseEtapa;

  const etapaRow = page.locator(`tr:has-text("${nomeDaEtapa}")`);
  await expect(etapaRow).toBeVisible();


  // --- ETAPA 4: ADICIONAR UMA COMPOSIÇÃO ---
  await etapaRow.click();
  await page.getByText('Composição', { exact: true }).locator('..').click();

  const modal = page.locator('div.fixed.bg-black.bg-opacity-50');
  await expect(modal).toBeVisible();
  await modal.getByPlaceholder('Pesquisar por descrição...').fill('CONCRETO');
  await expect(modal.locator('ul > li', { hasText: 'CONCRETO' }).first()).toBeVisible();

  const refetchPromiseComposicao = page.waitForResponse(/\/rest\/v1\/orcamento_itens_detalhados/);
  await modal.locator('ul > li').first().click();
  await refetchPromiseComposicao;

  const composicaoRow = etapaRow.locator('+ tr');
  await expect(composicaoRow).toBeVisible();

  const numeroEtapa = await etapaRow.locator('td').nth(1).innerText();
  await expect(composicaoRow.locator('td').nth(1)).toHaveText(`${numeroEtapa}.1`);
});
