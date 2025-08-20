import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../../components/dashboard/StudentSidebar';
import Header from '../../components/dashboard/Header';

const StudentDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Reutilizamos o Header, mas sem a função de toggle */}
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;