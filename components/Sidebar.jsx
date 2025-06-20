'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Home, 
  Eye, 
  Database,
  Activity,
  X,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, isSidebarOpen, setSidebarOpen }) => {
  const [expandedItems, setExpandedItems] = useState(['visibility']);

  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPage]);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Overview & Metrics'
    },
    { 
      id: 'visibility', 
      label: 'Visibility', 
      icon: Eye,
      description: 'Traffic Analysis',
      submenu: [
        { id: 'traffic-overview', label: 'Traffic Overview', icon: BarChart3 },
      ]
    },
  ];

  const toggleExpanded = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleMenuClick = (item) => {
    if (item.submenu) {
      toggleExpanded(item.id);
      if (!expandedItems.includes(item.id)) {
        setCurrentPage(item.submenu[0].id);
      }
    } else {
      setCurrentPage(item.id);
    }
  };

  const isActive = (itemId) => {
    if (itemId === currentPage) return true;
    const item = menuItems.find(m => m.id === itemId);
    return item?.submenu?.some(sub => sub.id === currentPage);
  };

  const isSubItemActive = (subItemId) => currentPage === subItemId;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0  bg-opacity-10 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        left-0 top-0 
        h-screen 
        w-72 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
        z-50 lg:z-auto
        transform transition-all duration-300 ease-in-out 
        border-r border-slate-700/50 
        flex flex-col
        flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
             <Image 
               src="/imesh-logo.png"
               width={100}
               alt='hi'
               height={100}
             />
             
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.id);
              const isExpanded = expandedItems.includes(item.id);
              
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isItemActive 
                        ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      isItemActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      <div className="text-xs opacity-75 truncate">{item.description}</div>
                    </div>
                    {item.submenu && (
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>

                  {item.submenu && isExpanded && (
                    <div className="ml-4 space-y-1 border-l border-slate-700/50 pl-4">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isSubItemActive(subItem.id);
                        
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => setCurrentPage(subItem.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                              isSubActive
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer Status */}
        <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Database className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-200 truncate">Cluster Status</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-700/30 rounded-lg p-2 min-w-0">
                <div className="text-slate-400 truncate">Nodes</div>
                <div className="text-slate-200 font-semibold truncate">12 Active</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-2 min-w-0">
                <div className="text-slate-400 truncate">Pods</div>
                <div className="text-slate-200 font-semibold truncate">847 Running</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;