'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import TrafficOverview from '../components/TrafficOverview';

const Page = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'traffic-overview':
        return <TrafficOverview />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <div className="lg:hidden">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full lg:w-auto">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <div className="w-6 h-6 flex flex-col gap-1 justify-center">
              <div className="w-full h-0.5 bg-gray-600 rounded"></div>
              <div className="w-full h-0.5 bg-gray-600 rounded"></div>
              <div className="w-full h-0.5 bg-gray-600 rounded"></div>
            </div>
            <span className="font-medium">Menu</span>
          </button>
        </div>

        <main className="flex-1 overflow-auto w-full min-w-0">
          <div className="w-full max-w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;