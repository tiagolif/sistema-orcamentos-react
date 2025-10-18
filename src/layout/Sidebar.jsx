import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
  const [menusAbertos, setMenusAbertos] = useState({ cadastros: true });

  const toggleMenu = (menu) => {
    setMenusAbertos(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className={`sidebar ${isSidebarExpanded ? 'layout-expanded' : 'layout-collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <img src="/hidrosantec_logo.png" alt="Logo Hidrosantec" className="sidebar-logo" />
          <h2 className="sidebar-company-name">Hidrosantec</h2>
        </div>
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Link Direto */}
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fa-solid fa-chart-pie"></i>
              <span className="nav-text">Painel</span>
            </NavLink>
          </li>

          {/* Menu Expansível: Orçamentos */}
          <li className={`menu-item ${menusAbertos.orcamentos ? 'open' : ''}`}>
            <button type="button" className="nav-link" onClick={() => toggleMenu('orcamentos')}>
              <span>
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <span className="nav-text">Orçamentos</span>
              </span>
              <i className="fa-solid fa-chevron-right menu-toggle-icon"></i>
            </button>
            <ul className={`submenu ${menusAbertos.orcamentos ? 'open' : ''}`}>
              <li><NavLink to="/orcamentos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Lista de Orçamentos</span></NavLink></li>
              <li><NavLink to="/orcamentos/novo" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Criar Orçamento</span></NavLink></li>
            </ul>
          </li>
          
          {/* Links Diretos Placeholder */}
          <li><NavLink to="/composicoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-cubes-stacked"></i><span className="nav-text">Composições</span></NavLink></li>
          <li><NavLink to="/insumos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-box"></i><span className="nav-text">Insumos</span></NavLink></li>
          <li><NavLink to="/planejamentos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-calendar-days"></i><span className="nav-text">Planejamentos</span></NavLink></li>
          <li><NavLink to="/diario-de-obras" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-book-open"></i><span className="nav-text">Diário de Obras</span></NavLink></li>
          <li><NavLink to="/medicoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-ruler-combined"></i><span className="nav-text">Medições</span></NavLink></li>
          <li><NavLink to="/compras" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><i className="fa-solid fa-shopping-cart"></i><span className="nav-text">Compras</span></NavLink></li>

          {/* Menu Expansível: Cadastros */}
          <li className={`menu-item ${menusAbertos.cadastros ? 'open' : ''}`}>
            <button type="button" className="nav-link" onClick={() => toggleMenu('cadastros')}>
              <span>
                <i className="fa-solid fa-pencil-ruler"></i>
                <span className="nav-text">Cadastros</span>
              </span>
              <i className="fa-solid fa-chevron-right menu-toggle-icon"></i>
            </button>
            <ul className={`submenu ${menusAbertos.cadastros ? 'open' : ''}`}>
              <li><NavLink to="/clientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Clientes</span></NavLink></li>
              <li><NavLink to="/fornecedores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Fornecedores</span></NavLink></li>
              <li><NavLink to="/recursos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Recursos</span></NavLink></li>
              <li><NavLink to="/bdi" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">BDI</span></NavLink></li>
              <li><NavLink to="/encargos-sociais" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-text">Encargos Sociais</span></NavLink></li>
            </ul>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;