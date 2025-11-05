import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { IoSettingsOutline } from 'react-icons/io5'; // Import IoSettingsOutline

const Sidebar = ({ isSidebarExpanded, toggleSidebar, isModalOpen, setIsModalOpen }) => {
  const [menusAbertos, setMenusAbertos] = useState({ cadastros: true });
  const location = useLocation(); // Obter o objeto de localização

  const toggleMenu = (menu) => {
    setMenusAbertos(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className={`bg-primary h-screen p-4 text-white transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden flex-shrink-0 ${isSidebarExpanded ? 'w-60' : 'w-20'}`}> {/* sidebar */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-base-border"> {/* sidebar-header */}
        <div className="flex items-center gap-3"> {/* logo-section */}
          <img src="/hidrosantec_logo.png" alt="Logo Hidrosantec" className="w-10 h-auto" /> {/* sidebar-logo */}
          <h2 className={`text-base font-semibold text-white ${isSidebarExpanded ? 'block' : 'hidden'}`}>Hidrosantec</h2> {/* sidebar-company-name */}
        </div>
        <Button variant="ghost" onClick={toggleSidebar} className="bg-transparent border-none text-gray-400 text-lg cursor-pointer p-2 rounded-md hover:bg-gray-700 hover:text-white"> {/* sidebar-toggle-btn */}
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </Button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Link Direto */}
          <li>
            <NavLink to="/" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}> {/* nav-link active */}
              <i className="fa-solid fa-chart-pie"></i>
              <span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Painel</span> {/* nav-text */}
            </NavLink>
          </li>

          {/* Menu Expansível: Orçamentos */}
          <li className={`relative menu-item ${menusAbertos.orcamentos ? 'open' : ''}`}>
            <Button type="button" variant="ghost" className="flex items-center justify-between gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full hover:bg-slate-600 hover:text-white" onClick={() => toggleMenu('orcamentos')}>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Orçamentos</span>
              </div>
              <i className={`fa-solid fa-chevron-right transition-transform duration-300 ease ${menusAbertos.orcamentos ? 'rotate-90' : ''} ${isSidebarExpanded ? 'block' : 'hidden'}`}></i>
            </Button>
            <ul className={`list-none pl-6 ml-5`}> {/* submenu open */}
              <li><NavLink to="/orcamentos" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/orcamentos' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Lista de Orçamentos</span></NavLink></li>
              <li><NavLink to="/orcamentos/novo" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/orcamentos/novo' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Criar Orçamento</span></NavLink></li>
              <li><NavLink to="/bases-de-preco" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/bases-de-preco' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Bases de Preço</span></NavLink></li>
            </ul>
          </li>
          
          {/* Links Diretos Placeholder */}
          <li><NavLink to="/composicoes" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/composicoes' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-cubes-stacked"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Composições</span></NavLink></li>
          <li><NavLink to="/insumos" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/insumos' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-box"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Insumos</span></NavLink></li>
          <li><NavLink to="/planejamentos" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/planejamentos' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-calendar-days"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Planejamentos</span></NavLink></li>
          <li><NavLink to="/diario-de-obras" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/diario-de-obras' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-book-open"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Diário de Obras</span></NavLink></li>
          <li><NavLink to="/medicoes" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/medicoes' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-ruler-combined"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Medições</span></NavLink></li>
          <li><NavLink to="/compras" className={`flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full ${location.pathname === '/compras' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><i className="fa-solid fa-shopping-cart"></i><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Compras</span></NavLink></li>

          {/* Menu Expansível: Cadastros */}
          <li className={`relative menu-item ${menusAbertos.cadastros ? 'open' : ''}`}>
            <Button type="button" variant="ghost" className="flex items-center justify-between gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full hover:bg-slate-600 hover:text-white" onClick={() => toggleMenu('cadastros')}>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-pencil-ruler"></i>
                <span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Cadastros</span>
              </div>
              <i className={`fa-solid fa-chevron-right transition-transform duration-300 ease ${menusAbertos.cadastros ? 'rotate-90' : ''} ${isSidebarExpanded ? 'block' : 'hidden'}`}></i>
            </Button>
            <ul className={`list-none pl-6 ml-5 mt-2 ${menusAbertos.cadastros ? 'block' : 'hidden'}`}>
              <li><NavLink to="/clientes" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/clientes' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Clientes</span></NavLink></li>
              <li><NavLink to="/fornecedores" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/fornecedores' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Fornecedores</span></NavLink></li>
              <li><NavLink to="/recursos" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/recursos' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Recursos</span></NavLink></li>
              <li><NavLink to="/bdi" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/bdi' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>BDI</span></NavLink></li>
              <li><NavLink to="/encargos-sociais" className={`flex items-center gap-4 py-1.5 px-3 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full text-sm ${location.pathname === '/encargos-sociais' ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-600 hover:text-white'}`}><span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Encargos Sociais</span></NavLink></li>
            </ul>
          </li>
          {/* Theme Settings Button */}
          <li className="mt-auto"> {/* Use mt-auto to push it to the bottom */}
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-4 py-2 px-4 text-gray-200 rounded-md font-medium transition-all duration-300 ease-in-out whitespace-nowrap w-full hover:bg-slate-600 hover:text-white"
            >
              <IoSettingsOutline className="text-xl" />
              <span className={`${isSidebarExpanded ? 'block' : 'hidden'}`}>Configurações</span>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-base-border">
      </div>
    </div>
  );
};

export default Sidebar;