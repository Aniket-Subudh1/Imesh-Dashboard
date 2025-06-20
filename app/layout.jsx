'use client';
import Sidebar from '../components/Sidebar'; 
import { useState } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>IMESH Dashboard</title>
        <meta name="description" content="Service Mesh Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
       
          <main className="flex-1">

          <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
            {children}
          </main>
      </body>
    </html>
  );
}