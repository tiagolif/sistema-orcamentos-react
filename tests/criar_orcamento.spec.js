import { test, expect } from '@playwright/test';

test.describe('Fluxo de Criação de Orçamento', () => {
  // Aumenta o timeout para este conjunto de testes, pois o fluxo é mais longo
  test.setTimeout(60000);

  test('Agente E2E Teste 04: Deve criar um novo orçamento completo', async ({ page }) => {
    // 1. Navegar para a página inicial
    await page.goto('http://localhost:5173/');

    // 2. Navegar pelo menu para criar um novo orçamento
    await page.getByRole('button', { name: 'Orçamentos' }).click();
    const criarOrcamentoLink = page.getByRole('link', { name: 'Criar Orçamento' });
    await expect(criarOrcamentoLink).toBeVisible();
    await criarOrcamentoLink.click();

    // --- PASSO 1: Informações Gerais ---
    await expect(page.getByRole('heading', { name: 'Passo 1: Informações Gerais' })).toBeVisible();

    // Usar placeholder para encontrar o input, pois a label não está associada
    await page.getByPlaceholder('Ex: Construção de muro residencial').fill(`Orçamento de Teste E2E - ${Date.now()}`);

    // Usar seletor CSS para o select, pois a label também não está associada
    await page.locator('select[name="cliente_id"]').selectOption({ index: 1 });

    // Clicar em Próximo
    await page.getByRole('button', { name: 'Próximo' }).click();

    // --- PASSO 2: Encargos e BDI ---
    await expect(page.getByRole('heading', { name: 'Passo 2: Arredondamento, Encargos e BDI' })).toBeVisible();
    
    // Clicar em Próximo
    await page.getByRole('button', { name: 'Próximo' }).click();

    // --- PASSO 3: Bases de Custo ---
    await expect(page.getByRole('heading', { name: 'Passo 3: Bases de Custo' })).toBeVisible();

    // Clicar em Finalizar e Salvar
    await page.getByRole('button', { name: 'Finalizar e Salvar' }).click();

    // --- VERIFICAÇÃO FINAL ---
    // Aguardar o redirecionamento para a página de edição do novo orçamento
    await page.waitForURL(new RegExp('/orcamentos/[a-f0-9-]+/editar'));

    // Verificar se a URL final está correta
    expect(page.url()).toContain('/editar');

    // Verificar se o passo final do wizard é exibido (confirmação de que estamos na página de edição)
    await expect(page.getByRole('heading', { name: 'Passo 3: Bases de Custo' })).toBeVisible();
  });
});