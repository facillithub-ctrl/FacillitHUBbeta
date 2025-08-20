import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/dashboard/Header';
import GestorSidebar from '../../components/dashboard/GestorSidebar'; // 1. Importar a sidebar correta

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // 2. Adicionar estado de controle

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 3. Usar a GestorSidebar e passar o estado */}
      <GestorSidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;