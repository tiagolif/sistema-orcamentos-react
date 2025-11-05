import { test, expect } from '@playwright/test';

test.describe('Fluxo de Criação de Fornecedor', () => {
  test('Agente E2E Teste 02: Deve criar um novo fornecedor (Pessoa Jurídica)', async ({ page }) => {
    // 1. Navegar para a página inicial
    await page.goto('http://localhost:5173/');

    // 2. Clicar diretamente no link "Fornecedores", que já está visível
    const fornecedoresLink = page.getByRole('link', { name: 'Fornecedores', exact: true });
    await expect(fornecedoresLink).toBeVisible();
    await fornecedoresLink.click();

    // 3. Na página de listagem, clicar em "Adicionar Novo Fornecedor"
    await expect(page.getByRole('heading', { name: 'Gestão de Fornecedores' })).toBeVisible();
    await page.getByRole('button', { name: 'Adicionar Novo Fornecedor' }).click();

    // 4. Aguardar o formulário de criação carregar e preencher os campos
    await expect(page.getByRole('heading', { name: 'Cadastro de Fornecedores' })).toBeVisible();
    
    const razaoSocial = `Empresa Teste ${Date.now()}`;
    await page.getByLabel('Razão Social').fill(razaoSocial);
    await page.getByLabel('Nome Fantasia').fill('Nome Fantasia Teste');
    await page.getByLabel('CNPJ').fill('00.000.000/0001-00');
    await page.getByLabel('E-mail').fill('teste@empresa.com');
    await page.getByLabel('Telefone').fill('(48) 99999-9999');

    // 5. Clicar no botão para salvar
    await page.getByRole('button', { name: 'Salvar Fornecedor' }).click();

    // 6. Verificar o redirecionamento de volta para a lista de fornecedores
    await page.waitForURL('**/fornecedores');
    expect(page.url()).toContain('/fornecedores');

    // 7. Opcional: Verificar se uma mensagem de sucesso ou o novo item aparecem
    await expect(page.getByRole('heading', { name: 'Gestão de Fornecedores' })).toBeVisible();
    // await expect(page.getByText(razaoSocial)).toBeVisible();
  });
});
