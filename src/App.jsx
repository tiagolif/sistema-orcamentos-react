import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import OrcamentosPage from './pages/OrcamentosPage.jsx';
import Clientes from './pages/Clientes.jsx';
import Fornecedores from './pages/Fornecedores.jsx';
import Obras from './pages/Obras.jsx';
import RecursosPage from './pages/RecursosPage.jsx';
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
import OrcamentoDetalhesPage from './pages/OrcamentoDetalhesPage.jsx'; // Import OrcamentoDetalhesPage
import PaginaOrcamento from './pages/PaginaOrcamento.jsx'; // Import PaginaOrcamento

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="orcamentos" element={<OrcamentosPage />} />
        <Route path="orcamentos/novo" element={<OrcamentoWizard />} />
        <Route path="orcamentos/:id/editar" element={<OrcamentoWizard />} />
        <Route path="orcamento/:id" element={<PaginaOrcamento />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/novo" element={<ClientForm />} />
        <Route path="clientes/:id/editar" element={<ClientForm />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="fornecedores/novo" element={<SupplierForm />} />
        <Route path="fornecedores/:id/editar" element={<SupplierForm />} />
        <Route path="obras" element={<Obras />} />
        <Route path="recursos" element={<RecursosPage />} />
        <Route path="composicoes" element={<ComposicoesPage />} />
        <Route path="composicoes/novo" element={<ComposicaoPage />} />
        <Route path="composicoes/:id/editar" element={<ComposicaoPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="insumos/novo" element={<InsumoPage />} />
        <Route path="insumos/:id/editar" element={<InsumoPage />} />
        <Route path="bdi" element={<BdiPage />} />
        <Route path="encargos-sociais" element={<EncargosSociaisPage />} />
        <Route path="planejamentos" element={<PlanejamentosPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="medicoes" element={<MedicoesPage />} />
        <Route path="diario-de-obras" element={<DiarioDeObrasPage />} />
        <Route path="bases-de-preco" element={<BasesDePrecoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
