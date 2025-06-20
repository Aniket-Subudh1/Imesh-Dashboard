'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <div className="flex">
           
          <Sidebar
           currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}/>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}