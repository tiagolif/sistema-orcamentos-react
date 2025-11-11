import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrcamentosPage from './pages/OrcamentosPage.jsx';
import Clientes from './pages/Clientes.jsx';
import Fornecedores from './pages/Fornecedores.jsx';
import RecursosPage from './pages/RecursosPage.jsx';
import RecursosForm from './components/recursos/RecursosForm.jsx';
import RecursoDetalhePage from './pages/RecursoDetalhePage.jsx';
import ComposicoesPage from './pages/ComposicoesPage.jsx';
import ComposicaoPage from './pages/ComposicaoPage.jsx';
import InsumosPage from './pages/InsumosPage.jsx';
import InsumoPage from './pages/InsumoPage.jsx';
import BdiPage from './pages/BdiPage.jsx';
import EncargosSociaisPage from './pages/EncargosSociaisPage.jsx';
import PlanejamentosPage from './pages/PlanejamentosPage.jsx';
import ComprasPage from './pages/ComprasPage.jsx';
import MedicoesPage from './pages/MedicoesPage.jsx';
import DiarioDeObrasPage from './pages/DiarioDeObrasPage.jsx';
import BasesDePrecoPage from './pages/BasesDePrecoPage.jsx';
import ClientForm from './components/clients/ClientForm.jsx';
import SupplierForm from './components/suppliers/SupplierForm.jsx';
import OrcamentoWizard from './components/orcamentos/OrcamentoWizard.jsx';
import OrcamentoDetalhesPage from './pages/OrcamentoDetalhesPage.jsx';
import PaginaOrcamento from './pages/PaginaOrcamento.jsx';
import ContasPagarPage from './pages/financeiro/ContasPagarPage.jsx';
import ContasReceberPage from './pages/financeiro/ContasReceberPage.jsx';
import FluxoCaixaPage from './pages/financeiro/FluxoCaixaPage.jsx';
import BoletimDetalhePage from './pages/medicoes/BoletimDetalhePage.jsx';
import ClienteDetalhePage from './pages/ClienteDetalhePage.jsx';
import FornecedorDetalhePage from './pages/FornecedorDetalhePage.jsx';
import ObrasPage from './pages/ObrasPage.jsx';
import NovaObraPage from './pages/NovaObraPage.jsx';
import ObraDetalhePage from './pages/ObraDetalhePage.jsx';
import LancamentoDetalhePage from './pages/financeiro/LancamentoDetalhePage.jsx';
import ApontamentosPage from './pages/ApontamentosPage.jsx';
import FormApontamento from './pages/FormApontamento.jsx';
import ApontamentoDetalhePage from './pages/ApontamentoDetalhePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orcamentos" element={<OrcamentosPage />} />
        <Route path="orcamentos/novo" element={<OrcamentoWizard />} />
        <Route path="orcamentos/editar/:id" element={<OrcamentoWizard />} />
        <Route path="orcamento/:id" element={<PaginaOrcamento />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/novo" element={<ClientForm />} />
        <Route path="clientes/editar/:id" element={<ClientForm />} />
        <Route path="clientes/visualizar/:id" element={<ClienteDetalhePage />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="fornecedores/novo" element={<SupplierForm />} />
        <Route path="fornecedores/editar/:id" element={<SupplierForm />} />
        <Route path="fornecedores/visualizar/:id" element={<FornecedorDetalhePage />} />
        <Route path="cadastros/obras" element={<ObrasPage />} />
        <Route path="cadastros/obras/novo" element={<NovaObraPage />} />
        <Route path="cadastros/obras/editar/:id" element={<NovaObraPage />} />
        <Route path="cadastros/obras/visualizar/:id" element={<ObraDetalhePage />} />
        <Route path="cadastros/recursos" element={<RecursosPage />} />
        <Route path="cadastros/recursos/novo" element={<RecursosForm />} />
        <Route path="cadastros/recursos/editar/:id" element={<RecursosForm />} />
        <Route path="cadastros/recursos/visualizar/:id" element={<RecursoDetalhePage />} />
        <Route path="apontamentos" element={<ApontamentosPage />} />
        <Route path="apontamentos/novo" element={<FormApontamento />} />
        <Route path="apontamentos/editar/:id" element={<FormApontamento />} />
        <Route path="apontamentos/visualizar/:id" element={<ApontamentoDetalhePage />} />
        <Route path="composicoes" element={<ComposicoesPage />} />
        <Route path="composicoes/novo" element={<ComposicaoPage />} />
        <Route path="composicoes/editar/:id" element={<ComposicaoPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="insumos/novo" element={<InsumoPage />} />
        <Route path="insumos/editar/:id" element={<InsumoPage />} />
        <Route path="bdi" element={<BdiPage />} />
        <Route path="encargos-sociais" element={<EncargosSociaisPage />} />
        <Route path="planejamentos" element={<PlanejamentosPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="medicoes" element={<MedicoesPage />} />
        <Route path="medicoes/boletim/:id" element={<BoletimDetalhePage />} />
        <Route path="diario-de-obras" element={<DiarioDeObrasPage />} />
        <Route path="bases-de-preco" element={<BasesDePrecoPage />} />
        <Route path="financeiro/contas-a-pagar" element={<ContasPagarPage />} />
        <Route path="financeiro/contas-a-pagar/visualizar/:id" element={<LancamentoDetalhePage />} />
        <Route path="financeiro/contas-a-receber" element={<ContasReceberPage />} />
        <Route path="financeiro/contas-a-receber/visualizar/:id" element={<LancamentoDetalhePage />} />
        <Route path="financeiro/fluxo-de-caixa" element={<FluxoCaixaPage />} />
      </Route>
    </Routes>
  );
}

export default App;
