import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/dashboard/Header';
import ProfessorSidebar from '../../components/dashboard/ProfessorSidebar'; // 1. Importar a nova sidebar do professor

const ProfessorDashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 2. Usar o novo componente ProfessorSidebar */}
      <ProfessorSidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboardLayout;