import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClientForm from './components/ClientForm';
import Fornecedores from './pages/Fornecedores';
import SupplierForm from './components/suppliers/SupplierForm';
import Obras from './pages/Obras';
import WorkForm from './components/works/WorkForm';
import RecursosPage from './pages/RecursosPage';
import RecursosForm from './components/recursos/RecursosForm';
import OrcamentosPage from './pages/OrcamentosPage';
import OrcamentoWizard from './components/orcamentos/OrcamentoWizard'; // Importa o novo assistente

// Novas páginas placeholder
import ComposicoesPage from './pages/ComposicoesPage';
import InsumosPage from './pages/InsumosPage';
import PlanejamentosPage from './pages/PlanejamentosPage';
import DiarioDeObrasPage from './pages/DiarioDeObrasPage';
import MedicoesPage from './pages/MedicoesPage';
import ComprasPage from './pages/ComprasPage';
import BdiPage from './pages/BdiPage';
import EncargosSociaisPage from './pages/EncargosSociaisPage';

function App() {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Orçamentos */}
          <Route path="/orcamentos" element={<OrcamentosPage />} />
          <Route path="/orcamentos/novo" element={<OrcamentoWizard />} /> {/* Rota atualizada */}

          {/* Placeholders */}
          <Route path="/composicoes" element={<ComposicoesPage />} />
          <Route path="/insumos" element={<InsumosPage />} />
          <Route path="/planejamentos" element={<PlanejamentosPage />} />
          <Route path="/diario-de-obras" element={<DiarioDeObrasPage />} />
          <Route path="/medicoes" element={<MedicoesPage />} />
          <Route path="/compras" element={<ComprasPage />} />

          {/* Cadastros */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/novo" element={<ClientForm />} />
          <Route path="/clientes/editar/:id" element={<ClientForm />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/fornecedores/novo" element={<SupplierForm />} />
          <Route path="/fornecedores/editar/:id" element={<SupplierForm />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/recursos/novo" element={<RecursosForm />} />
          <Route path="/bdi" element={<BdiPage />} />
          <Route path="/encargos-sociais" element={<EncargosSociaisPage />} />

          {/* Obras (já existia) */}
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/novo" element={<WorkForm />} />

        </Route>
        {/* Rotas que não devem usar o MainLayout podem ser adicionadas aqui */}
      </Routes>
  );
}

export default App;