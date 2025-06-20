'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Eye, 
  Network, 
  Shield, 
  Settings,
  Database,
  Activity,
  X,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  GitBranch,
  Cpu
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, isSidebarOpen, setSidebarOpen }) => {
  const [expandedItems, setExpandedItems] = useState(['visibility']);

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
        { id: 'errors', label: 'Error Analysis', icon: AlertTriangle },
        { id: 'mesh-topology', label: 'Mesh Topology', icon: GitBranch },
        { id: 'control-plane', label: 'Control Plane', icon: Cpu }
      ]
    },
    { 
      id: 'topology', 
      label: 'Topology', 
      icon: Network,
      description: 'Service Map'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      description: 'Policies & mTLS'
    },
    { 
      id: 'config', 
      label: 'Configuration', 
      icon: Settings,
      description: 'Istio Settings'
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
      setSidebarOpen(false);
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
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto border-r border-slate-700/50`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                IMESH
              </span>
              <div className="text-xs text-slate-400 font-medium">Service Mesh</div>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
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
                    <div className={`p-2 rounded-lg transition-colors ${
                      isItemActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                    {item.submenu && (
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu && isExpanded && (
                    <div className="ml-4 space-y-1 border-l border-slate-700/50 pl-4">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isSubItemActive(subItem.id);
                        
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setCurrentPage(subItem.id);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                              isSubActive
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span>{subItem.label}</span>
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

        {/* Cluster Status */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-slate-200">Cluster Status</span>
              </div>
              <div className="flex-1"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-700/30 rounded-lg p-2">
                <div className="text-slate-400">Nodes</div>
                <div className="text-slate-200 font-semibold">12 Active</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-2">
                <div className="text-slate-400">Pods</div>
                <div className="text-slate-200 font-semibold">847 Running</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;