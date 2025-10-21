import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeModal from '../components/ThemeModal'; // Import ThemeModal

const MainLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true); // Inicia expandido
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control theme modal

  // Função para controlar o estado da sidebar
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  return (
    <div className="flex h-screen"> {/* main-layout */}
      <Sidebar 
        isSidebarExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} // Passa a nova função
        isModalOpen={isModalOpen} // Pass isModalOpen state
        setIsModalOpen={setIsModalOpen} // Pass setIsModalOpen function
      />
      <main className="flex-grow px-4 py-6 overflow-y-auto bg-gray-50"> {/* content-area */}
        <Outlet />
      </main>
      <ThemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MainLayout;
