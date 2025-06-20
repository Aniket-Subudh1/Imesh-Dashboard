'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import TrafficOverview from '../components/TrafficOverview';

// Import other components as needed
// import ErrorAnalysis from '../components/ErrorAnalysis';
// import MeshTopology from '../components/MeshTopology';
// import ControlPlane from '../components/ControlPlane';
// import Topology from '../components/Topology';
// import Security from '../components/Security';
// import Configuration from '../components/Configuration';

const Page = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'traffic-overview':
        return <TrafficOverview />;
      // case 'errors':
      //   return <ErrorAnalysis />;
      // case 'mesh-topology':
      //   return <MeshTopology />;
      // case 'control-plane':
      //   return <ControlPlane />;
      // case 'topology':
      //   return <Topology />;
      // case 'security':
      //   return <Security />;
      // case 'config':
      //   return <Configuration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content Area - Full width on mobile, remaining space on desktop */}
      <div className="flex-1 flex flex-col min-h-0 w-full lg:w-auto">
        {/* Mobile menu button */}
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

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Page;