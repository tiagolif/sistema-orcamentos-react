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


function App() {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/novo" element={<ClientForm />} />
          <Route path="/clientes/editar/:id" element={<ClientForm />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/fornecedores/novo" element={<SupplierForm />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/novo" element={<WorkForm />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/recursos/novo" element={<RecursosForm />} />
        </Route>
        {/* Rotas que não devem usar o MainLayout podem ser adicionadas aqui */}
      </Routes>
  );
}

export default App;

// Forçando a atualização do HMR.