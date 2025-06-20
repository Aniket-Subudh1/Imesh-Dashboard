'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  ChevronDown, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingUp, 
  Server, 
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

// Dynamically import Recharts components to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });

const generateMockData = (namespace, service, workload) => {
  const namespaceMultiplier = namespace === 'istio-system' ? 1.5 : namespace === 'default' ? 1.2 : 1.0;
  const serviceMultiplier = service === 'productpage' ? 1.3 : service === 'reviews' ? 1.1 : 1.0;
  const workloadMultiplier = workload.includes('v3') ? 1.2 : workload.includes('v2') ? 1.1 : 1.0;
  
  const totalMultiplier = namespaceMultiplier * serviceMultiplier * workloadMultiplier;
  
  const baseErrorRate = service === 'reviews' ? 2.1 : service === 'ratings' ? 0.8 : 1.2;
  const errorRate = (baseErrorRate * totalMultiplier).toFixed(2);
  
  const baseLatency = workload.includes('v1') ? 220 : workload.includes('v2') ? 180 : 160;
  const latency = (baseLatency * totalMultiplier).toFixed(1);
  
  const healthTotal = 5;
  const healthCurrent = errorRate > 2 ? 3 : errorRate > 1.5 ? 4 : 5;
  
  return {
    dashboardStats: {
      serviceHealth: { current: healthCurrent, total: healthTotal },
      errorRate: parseFloat(errorRate),
      latency: parseFloat(latency)
    },
    trafficData: Array.from({ length: 24 }, (_, i) => {
      const time = `${String(i).padStart(2, '0')}:00`;
      const baseRequests = 150 + Math.sin(i * 0.5) * 100;
      const requests = Math.round(baseRequests * totalMultiplier);
      const errors = Math.round(requests * (errorRate / 100));
      const requestLatency = Math.round(latency + Math.random() * 40 - 20);
      const cpu = Math.round(30 + Math.sin(i * 0.3) * 20 + Math.random() * 10);
      const memory = Math.round(45 + Math.sin(i * 0.4) * 15 + Math.random() * 8);
      
      return {
        time,
        requests,
        errors,
        latency: requestLatency,
        cpu,
        memory,
        successRate: ((requests - errors) / requests * 100).toFixed(1)
      };
    })
  };
};

const BRAND_COLORS = {
  primary: '#1e3a8a',
  secondary: '#e91e63', 
  accent: '#06b6d4', 
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  dark: '#1f2937',
  light: '#f8fafc'
};

const mockStaticData = {
  namespaces: ['All Namespaces', 'default', 'istio-system', 'kube-system', 'monitoring'],
  services: ['All Services', 'productpage', 'details', 'ratings', 'reviews', 'bookinfo-gateway'],
  workloads: ['All Workloads', 'reviews-v1', 'reviews-v2', 'reviews-v3', 'productpage-v1', 'details-v1'],
  
  alerts: [
    { id: 1, type: 'error', title: 'High Error Rate', message: 'reviews-v2 service showing 3.2% error rate', time: '2 min ago' },
    { id: 2, type: 'warning', title: 'Latency Spike', message: 'p95 latency increased to 450ms in ratings service', time: '5 min ago' },
    { id: 3, type: 'info', title: 'Deployment Complete', message: 'productpage-v1 successfully updated', time: '10 min ago' },
  ],
  
  systemResources: {
    cpu: { used: 65, total: 100, trend: 5.2 },
    memory: { used: 78, total: 100, trend: -2.1 },
    storage: { used: 45, total: 100, trend: 1.8 },
    network: { ingress: 125.6, egress: 89.3, trend: 12.4 }
  }
};

const Dropdown = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-w-[200px] shadow-sm"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color = 'blue', suffix = '', trend, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const getHealthColor = () => {
    if (title.includes('Error Rate') && parseFloat(value) > 1.5) return 'red';
    if (title.includes('Latency') && parseFloat(value) > 200) return 'yellow';
    if (title.includes('Health') && typeof value === 'object' && value.current < value.total) {
      return value.current < 3 ? 'red' : 'yellow';
    }
    return 'green';
  };

  const cardColor = color === 'blue' ? getHealthColor() : color;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colorClasses[cardColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">
          {typeof value === 'object' ? `${value.current}/${value.total}` : value}
          <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>
        </p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

const ResourceCard = ({ title, icon: Icon, used, total, trend, unit = '%' }) => {
  const percentage = (used / total) * 100;
  const getColor = () => {
    if (percentage > 80) return 'red';
    if (percentage > 60) return 'yellow';
    return 'green';
  };
  
  const color = getColor();
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">
              {used}{unit} / {total}{unit}
            </p>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          trend > 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Usage</span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const icons = {
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    success: CheckCircle
  };
  
  const colors = {
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200'
  };
  
  const Icon = icons[alert.type];
  
  return (
    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`p-1 rounded-lg border ${colors[alert.type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
      active 
        ? 'text-blue-600 border-blue-600 bg-blue-50' 
        : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-200 hover:bg-gray-50'
    }`}
  >
    {children}
    {count && (
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const Dashboard = () => {
  const [selectedNamespace, setSelectedNamespace] = useState('All Namespaces');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedWorkload, setSelectedWorkload] = useState('All Workloads');
  const [activeTab, setActiveTab] = useState('overview');

  const dynamicData = useMemo(() => 
    generateMockData(selectedNamespace, selectedService, selectedWorkload),
    [selectedNamespace, selectedService, selectedWorkload]
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="text-sm font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name.includes('CPU') || entry.name.includes('Memory') ? '%' : entry.name.includes('Latency') ? 'ms' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Mesh Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your Istio service mesh infrastructure</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">All Systems Operational</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Dropdown
            label="Namespace"
            value={selectedNamespace}
            options={mockStaticData.namespaces}
            onChange={setSelectedNamespace}
            icon={Server}
          />
          <Dropdown
            label="Service"
            value={selectedService}
            options={mockStaticData.services}
            onChange={setSelectedService}
            icon={Activity}
          />
          <Dropdown
            label="Workload"
            value={selectedWorkload}
            options={mockStaticData.workloads}
            onChange={setSelectedWorkload}
            icon={Users}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Service Health"
          value={dynamicData.dashboardStats.serviceHealth}
          icon={Activity}
          color="blue"
          description="Active services status"
        />
        <StatCard
          title="Error Rate"
          value={dynamicData.dashboardStats.errorRate}
          icon={AlertTriangle}
          color="blue"
          suffix="%"
          trend={-0.5}
          description="Last 24 hours"
        />
        <StatCard
          title="P95 Latency"
          value={dynamicData.dashboardStats.latency}
          icon={Clock}
          color="blue"
          suffix="ms"
          trend={-2.1}
          description="95th percentile"
        />
        <StatCard
          title="Throughput"
          value="2.3K"
          icon={TrendingUp}
          color="green"
          suffix="req/min"
          trend={12.4}
          description="Current rate"
        />
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard
          title="CPU Usage"
          icon={Cpu}
          used={mockStaticData.systemResources.cpu.used}
          total={mockStaticData.systemResources.cpu.total}
          trend={mockStaticData.systemResources.cpu.trend}
        />
        <ResourceCard
          title="Memory"
          icon={Database}
          used={mockStaticData.systemResources.memory.used}
          total={mockStaticData.systemResources.memory.total}
          trend={mockStaticData.systemResources.memory.trend}
        />
        <ResourceCard
          title="Storage"
          icon={HardDrive}
          used={mockStaticData.systemResources.storage.used}
          total={mockStaticData.systemResources.storage.total}
          trend={mockStaticData.systemResources.storage.trend}
        />
        <ResourceCard
          title="Network I/O"
          icon={Wifi}
          used={125.6}
          total={200}
          trend={mockStaticData.systemResources.network.trend}
          unit="MB/s"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <TabButton 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                Traffic Overview
              </TabButton>
              <TabButton 
                active={activeTab === 'resources'} 
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </TabButton>
              <TabButton 
                active={activeTab === 'performance'} 
                onClick={() => setActiveTab('performance')}
              >
                Performance
              </TabButton>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'overview' ? 'Request Metrics' : 
                 activeTab === 'resources' ? 'System Resources' : 
                 'Performance Metrics'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Live Data</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'overview' ? (
                  <AreaChart data={dynamicData.trafficData}>
                    <defs>
                      <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="requests" 
                      stroke={BRAND_COLORS.primary}
                      fillOpacity={1}
                      fill="url(#requestsGradient)"
                      strokeWidth={3}
                      name="Requests"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke={BRAND_COLORS.error}
                      strokeWidth={2}
                      name="Errors"
                      dot={false}
                    />
                  </AreaChart>
                ) : activeTab === 'resources' ? (
                  <LineChart data={dynamicData.trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke={BRAND_COLORS.secondary}
                      strokeWidth={3}
                      name="CPU %"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory" 
                      stroke={BRAND_COLORS.accent}
                      strokeWidth={3}
                      name="Memory %"
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <LineChart data={dynamicData.trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      stroke={BRAND_COLORS.warning}
                      strokeWidth={3}
                      name="Latency (ms)"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="successRate" 
                      stroke={BRAND_COLORS.success}
                      strokeWidth={3}
                      name="Success Rate %"
                      dot={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              {mockStaticData.alerts.length} New
            </span>
          </div>
          
          <div className="space-y-3">
            {mockStaticData.alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;