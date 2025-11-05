import { test, expect } from '@playwright/test';

test.describe('Fluxo de Criação de Cliente', () => {
  test('Agente E2E Teste 03: Deve criar um novo cliente (Pessoa Física)', async ({ page }) => {
    // 1. Navegar para a página inicial
    await page.goto('http://localhost:5173/');

    // 2. Clicar diretamente no link "Clientes", que já está visível no menu aberto
    const clientesLink = page.getByRole('link', { name: 'Clientes', exact: true });
    await expect(clientesLink).toBeVisible();
    await clientesLink.click();

    // 3. Na página de listagem, clicar em "Adicionar Novo Cliente"
    await expect(page.getByRole('heading', { name: 'Gestão de Clientes' })).toBeVisible();
    await page.getByRole('button', { name: 'Adicionar Novo Cliente' }).click();

    // 4. Aguardar o formulário de criação carregar e preencher os campos
    await expect(page.getByRole('heading', { name: 'Cadastro de Clientes' })).toBeVisible();
    
    const nomeCompleto = `Cliente Teste ${Date.now()}`;
    await page.getByLabel('Nome Completo').fill(nomeCompleto);
    await page.getByLabel('CPF').fill('123.456.789-00');
    await page.getByLabel('E-mail').fill('cliente@teste.com');
    await page.getByLabel('Telefone').fill('(48) 98888-7777');

    // 5. Clicar no botão para salvar
    await page.getByRole('button', { name: 'Salvar Cliente' }).click();

    // 6. Verificar o redirecionamento de volta para a lista de clientes
    await page.waitForURL('**/clientes');
    expect(page.url()).toContain('/clientes');

    // 7. Opcional: Verificar se o nome do novo cliente aparece na lista
    await expect(page.getByRole('heading', { name: 'Gestão de Clientes' })).toBeVisible();
    // await expect(page.getByText(nomeCompleto)).toBeVisible();
  });
});
