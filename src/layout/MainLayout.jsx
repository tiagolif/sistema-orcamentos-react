import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true); // Inicia expandido

  // Função para controlar o estado da sidebar
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  return (
    <div className={`main-layout ${isSidebarExpanded ? 'layout-expanded' : 'layout-collapsed'}`}>
      <Sidebar 
        isSidebarExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} // Passa a nova função
      />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;