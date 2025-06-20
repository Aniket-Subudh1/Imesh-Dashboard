'use client';

import React, { useState, useMemo } from 'react';
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
  Info,
  ArrowUp,
  ArrowDown,
  Eye,
  Shield,
  Settings
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts';

const Dashboard = () => {
  const [selectedNamespace, setSelectedNamespace] = useState('All Namespaces');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedWorkload, setSelectedWorkload] = useState('All Workloads');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChart, setSelectedChart] = useState('requests');
  const [timeRange, setTimeRange] = useState('24h');

  // Configuration data
  const namespaces = ['All Namespaces', 'default', 'istio-system', 'kube-system', 'monitoring', 'production'];
  const services = ['All Services', 'productpage', 'details', 'ratings', 'reviews', 'bookinfo-gateway', 'frontend', 'backend'];
  const workloads = ['All Workloads', 'reviews-v1', 'reviews-v2', 'reviews-v3', 'productpage-v1', 'details-v1', 'ratings-v1'];
  
  const alerts = [
    { 
      id: 1, 
      type: 'error', 
      title: 'High Error Rate', 
      message: 'reviews-v2 service showing 3.2% error rate in production namespace', 
      time: '2 min ago',
      severity: 'critical'
    },
    { 
      id: 2, 
      type: 'warning', 
      title: 'Latency Spike', 
      message: 'p95 latency increased to 450ms in ratings service', 
      time: '5 min ago',
      severity: 'warning'
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Deployment Complete', 
      message: 'productpage-v1 successfully updated with zero downtime', 
      time: '10 min ago',
      severity: 'info'
    },
    { 
      id: 4, 
      type: 'warning', 
      title: 'Memory Usage High', 
      message: 'Memory utilization reached 85% on node worker-3', 
      time: '15 min ago',
      severity: 'warning'
    },
    { 
      id: 5, 
      type: 'success', 
      title: 'Auto-scaling Triggered', 
      message: 'Successfully scaled reviews service from 3 to 5 replicas', 
      time: '20 min ago',
      severity: 'info'
    }
  ];

  // Color scheme
  const COLORS = {
    primary: '#3b82f6',
    secondary: '#e91e63',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    orange: '#f97316'
    
  };
   
  // Generate comprehensive dynamic data based on selections
  const generateDynamicData = useMemo(() => {
    const namespaceMultiplier = {
      'All Namespaces': 1.0,
      'istio-system': 1.5,
      'default': 1.2,
      'production': 2.0,
      'kube-system': 0.8,
      'monitoring': 0.6
    }[selectedNamespace] || 1.0;

    const serviceMultiplier = {
      'All Services': 1.0,
      'productpage': 1.8,
      'reviews': 1.4,
      'ratings': 1.1,
      'details': 0.9,
      'frontend': 1.6,
      'backend': 1.3
    }[selectedService] || 1.0;

    const workloadMultiplier = {
      'All Workloads': 1.0,
      'reviews-v3': 1.3,
      'reviews-v2': 1.1,
      'reviews-v1': 0.9,
      'productpage-v1': 1.2,
      'details-v1': 0.8,
      'ratings-v1': 1.0
    }[selectedWorkload] || 1.0;

    const totalMultiplier = namespaceMultiplier * serviceMultiplier * workloadMultiplier;
    
    const dataPoints = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : timeRange === '24h' ? 48 : 96;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const time = timeRange === '1h' 
        ? `${String(Math.floor(i * 5 / 60)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`
        : timeRange === '6h'
        ? `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`
        : `${String(i).padStart(2, '0')}:00`;

      // Simulate realistic traffic patterns
      const hourFactor = Math.sin(i * 0.5) * 0.3 + 1;
      const noiseFactor = 0.8 + Math.random() * 0.4;
      
      const baseRequests = Math.round(150 * hourFactor * totalMultiplier * noiseFactor);
      const baseErrors = Math.round(baseRequests * (0.005 + Math.random() * 0.02));
      const baseLatency = Math.round(120 + Math.sin(i * 0.4) * 40 + Math.random() * 30);
      const baseCpu = Math.round(30 + Math.sin(i * 0.3) * 20 + Math.random() * 10);
      const baseMemory = Math.round(45 + Math.sin(i * 0.4) * 15 + Math.random() * 8);
      const baseThroughput = Math.round(baseRequests * 0.8);
      const baseNetwork = Math.round(50 + Math.sin(i * 0.2) * 25 + Math.random() * 15);
      
      return {
        time,
        requests: baseRequests,
        errors: baseErrors,
        latency: baseLatency,
        cpu: Math.min(baseCpu, 100),
        memory: Math.min(baseMemory, 100),
        throughput: baseThroughput,
        networkIn: baseNetwork,
        networkOut: baseNetwork * 0.8,
        successRate: parseFloat(((baseRequests - baseErrors) / baseRequests * 100).toFixed(1)),
        p95Latency: baseLatency * 1.5,
        p99Latency: baseLatency * 2.1,
        activeConnections: Math.round(baseRequests * 0.1),
        qps: Math.round(baseThroughput / 60)
      };
    });
  }, [selectedNamespace, selectedService, selectedWorkload, timeRange]);

  // Calculate current metrics with real-time updates
  const currentMetrics = useMemo(() => {
    const recent = generateDynamicData.slice(-6);
    const totalRequests = recent.reduce((sum, item) => sum + item.requests, 0);
    const totalErrors = recent.reduce((sum, item) => sum + item.errors, 0);
    const avgLatency = recent.reduce((sum, item) => sum + item.latency, 0) / recent.length;
    const avgThroughput = recent.reduce((sum, item) => sum + item.throughput, 0) / recent.length;
    const avgCpu = recent.reduce((sum, item) => sum + item.cpu, 0) / recent.length;
    const avgMemory = recent.reduce((sum, item) => sum + item.memory, 0) / recent.length;
    
    // Calculate service health based on error rate and latency
    const errorRate = (totalErrors / totalRequests) * 100;
    const healthScore = errorRate < 1 && avgLatency < 200 ? 5 : 
                       errorRate < 2 && avgLatency < 300 ? 4 : 
                       errorRate < 5 && avgLatency < 500 ? 3 : 2;
    
    return {
      serviceHealth: { current: healthScore, total: 5 },
      errorRate: ((totalErrors / totalRequests) * 100).toFixed(2),
      latency: Math.round(avgLatency),
      throughput: (avgThroughput / 1000).toFixed(1),
      cpu: Math.round(avgCpu),
      memory: Math.round(avgMemory),
      activeServices: healthScore,
      totalServices: 5,
      uptime: 99.9
    };
  }, [generateDynamicData]);

  // Resource usage data
  const resourceData = [
    { 
      name: 'CPU Usage', 
      icon: Cpu, 
      used: currentMetrics.cpu, 
      total: 100, 
      trend: Math.random() > 0.5 ? 2.1 : -1.5,
      status: currentMetrics.cpu > 80 ? 'critical' : currentMetrics.cpu > 60 ? 'warning' : 'good'
    },
    { 
      name: 'Memory', 
      icon: Database, 
      used: currentMetrics.memory, 
      total: 100, 
      trend: Math.random() > 0.5 ? 1.8 : -2.1,
      status: currentMetrics.memory > 80 ? 'critical' : currentMetrics.memory > 60 ? 'warning' : 'good'
    },
    { 
      name: 'Storage', 
      icon: HardDrive, 
      used: 45, 
      total: 100, 
      trend: 1.2,
      status: 'good'
    },
    { 
      name: 'Network I/O', 
      icon: Wifi, 
      used: 63, 
      total: 100, 
      trend: 5.4,
      status: 'warning',
      unit: 'MB/s'
    }
  ];

  // Service topology data
  const serviceTopology = [
    { name: 'Gateway', value: 1, color: COLORS.primary },
    { name: 'Frontend Services', value: 3, color: COLORS.success },
    { name: 'Backend Services', value: 5, color: COLORS.warning },
    { name: 'Data Services', value: 2, color: COLORS.secondary },
    { name: 'External APIs', value: 4, color: COLORS.info }
  ];

  const Dropdown = ({ label, value, options, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
        >
          <div className="flex  items-center gap-2 min-w-0">
            {Icon && <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
            <span className="text-sm font-medium text-gray-900 truncate">{value}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-full text-black bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
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
          </>
        )}
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', suffix = '', trend, description, onClick }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };

    return (
      <div 
        className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-xl border ${colorClasses[color]}`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <ArrowUp className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
            {typeof value === 'object' ? `${value.current}/${value.total}` : value}
            <span className="text-xs md:text-sm font-normal text-gray-500 ml-1">{suffix}</span>
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    );
  };

  const ResourceCard = ({ resource }) => {
    const percentage = (resource.used / resource.total) * 100;
    const colorClasses = {
      good: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500'
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg flex-shrink-0">
              <resource.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">{resource.name}</h3>
              <p className="text-xs text-gray-500">
                {resource.used}{resource.unit || '%'} / {resource.total}{resource.unit || '%'}
              </p>
            </div>
          </div>
          <div className={`text-xs md:text-sm font-medium ${
            resource.trend > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {resource.trend > 0 ? '+' : ''}{resource.trend}%
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-600">Usage</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${colorClasses[resource.status]}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Status</span>
            <span className={`font-medium capitalize ${
              resource.status === 'good' ? 'text-green-600' :
              resource.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {resource.status}
            </span>
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
      <div className="flex items-start gap-3 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
        <div className={`p-1 rounded-lg border flex-shrink-0 ${colors[alert.type]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
              alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 break-words">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
        </div>
      </div>
    );
  };

  const TabButton = ({ active, onClick, children, count }) => (
    <button
      onClick={onClick}
      className={`relative px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 md:p-4 border border-gray-200 rounded-xl shadow-xl z-50">
          <p className="text-sm font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                entry.name.includes('CPU') || entry.name.includes('Memory') || entry.name.includes('Rate') ? '%' : 
                entry.name.includes('Latency') ? 'ms' : 
                entry.name.includes('Network') ? ' MB/s' : ''
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartData = () => {
    switch (selectedChart) {
      case 'requests':
        return generateDynamicData.map(item => ({ 
          ...item, 
          primary: item.requests,
          secondary: item.errors,
          primaryName: 'Requests',
          secondaryName: 'Errors'
        }));
      case 'errors':
        return generateDynamicData.map(item => ({ 
          ...item, 
          primary: item.errors,
          secondary: item.successRate,
          primaryName: 'Errors',
          secondaryName: 'Success Rate %'
        }));
      case 'latency':
        return generateDynamicData.map(item => ({ 
          ...item, 
          primary: item.latency,
          secondary: item.p95Latency,
          primaryName: 'Avg Latency',
          secondaryName: 'P95 Latency'
        }));
      case 'throughput':
        return generateDynamicData.map(item => ({ 
          ...item, 
          primary: item.throughput,
          secondary: item.qps,
          primaryName: 'Throughput',
          secondaryName: 'QPS'
        }));
      default:
        return generateDynamicData;
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Mesh Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Monitor and manage your Istio service mesh infrastructure
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Namespace: <strong>{selectedNamespace}</strong></span>
            <span>Service: <strong>{selectedService}</strong></span>
            <span>Workload: <strong>{selectedWorkload}</strong></span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs md:text-sm border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">All Systems Operational</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {alerts.filter(a => a.severity === 'critical').length}
              </span>
            </button>
            <button className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
              <Eye className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">View Topology</span>
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        {['1h', '6h', '24h', '7d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${
              timeRange === range
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Dropdown
            label="Namespace"
            value={selectedNamespace}
            options={namespaces}
            onChange={setSelectedNamespace}
            icon={Server}
          />
          <Dropdown
            label="Service"
            value={selectedService}
            options={services}
            onChange={setSelectedService}
            icon={Activity}
          />
          <Dropdown
            label="Workload"
            value={selectedWorkload}
            options={workloads}
            onChange={setSelectedWorkload}
            icon={Users}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          title="Service Health"
          value={currentMetrics.serviceHealth}
          icon={Activity}
          color="green"
          description="Active services status"
          onClick={() => setSelectedChart('requests')}
        />
        <StatCard
          title="Error Rate"
          value={currentMetrics.errorRate}
          icon={AlertTriangle}
          color={parseFloat(currentMetrics.errorRate) > 2 ? 'red' : parseFloat(currentMetrics.errorRate) > 1 ? 'yellow' : 'green'}
          suffix="%"
          trend={-0.5}
          description="Last 6 periods"
          onClick={() => setSelectedChart('errors')}
        />
        <StatCard
          title="P95 Latency"
          value={currentMetrics.latency}
          icon={Clock}
          color={currentMetrics.latency > 300 ? 'red' : currentMetrics.latency > 200 ? 'yellow' : 'green'}
          suffix="ms"
          trend={-2.1}
          description="95th percentile"
          onClick={() => setSelectedChart('latency')}
        />
        <StatCard
          title="Throughput"
          value={currentMetrics.throughput}
          icon={TrendingUp}
          color="blue"
          suffix="K/min"
          trend={12.4}
          description="Current rate"
          onClick={() => setSelectedChart('throughput')}
        />
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {resourceData.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Charts */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
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
              <TabButton 
                active={activeTab === 'topology'} 
                onClick={() => setActiveTab('topology')}
              >
                Topology
              </TabButton>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'overview' ? 'Request Metrics' : 
                 activeTab === 'resources' ? 'System Resources' : 
                 activeTab === 'performance' ? 'Performance Metrics' :
                 'Service Topology'}
              </h3>
              <div className="flex items-center gap-2 md:gap-4">
                {activeTab !== 'topology' && (
                  <select
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white min-w-[120px]"
                  >
                    <option value="requests">Requests</option>
                    <option value="errors">Errors</option>
                    <option value="latency">Latency</option>
                    <option value="throughput">Throughput</option>
                  </select>
                )}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'overview' ? (
                  <ComposedChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#64748b" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="primary" 
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorGradient)"
                      strokeWidth={3}
                      name={getChartData()[0]?.primaryName || 'Primary'}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="secondary" 
                      stroke={COLORS.error}
                      strokeWidth={2}
                      name={getChartData()[0]?.secondaryName || 'Secondary'}
                      dot={false}
                    />
                  </ComposedChart>
                ) : activeTab === 'resources' ? (
                  <LineChart data={generateDynamicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#64748b" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke={COLORS.secondary}
                      strokeWidth={3}
                      name="CPU %"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory" 
                      stroke={COLORS.info}
                      strokeWidth={3}
                      name="Memory %"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="networkIn" 
                      stroke={COLORS.warning}
                      strokeWidth={2}
                      name="Network In"
                      dot={false}
                    />
                  </LineChart>
                ) : activeTab === 'performance' ? (
                  <ComposedChart data={generateDynamicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#64748b" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="latency" 
                      stroke={COLORS.warning}
                      strokeWidth={3}
                      name="Latency (ms)"
                      dot={false}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="p95Latency" 
                      stroke={COLORS.orange}
                      strokeWidth={2}
                      name="P95 Latency (ms)"
                      dot={false}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="qps" 
                      fill={COLORS.success}
                      name="QPS"
                      opacity={0.7}
                    />
                  </ComposedChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={serviceTopology}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceTopology.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Analytics */}
            {activeTab === 'overview' && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {generateDynamicData.reduce((sum, item) => sum + item.requests, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {generateDynamicData.reduce((sum, item) => sum + item.errors, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Errors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round(generateDynamicData.reduce((sum, item) => sum + item.latency, 0) / generateDynamicData.length)}ms
                  </p>
                  <p className="text-sm text-gray-600">Avg Latency</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {(generateDynamicData.reduce((sum, item) => sum + item.successRate, 0) / generateDynamicData.length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alerts and Quick Actions Panel */}
        <div className="xl:col-span-1 space-y-4 md:space-y-6">
          {/* Alerts Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {alerts.filter(a => a.severity === 'critical').length} Critical
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 4).map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
              View All Alerts ({alerts.length})
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">View Service Map</p>
                  <p className="text-sm text-blue-600">Visualize service dependencies</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Security Policies</p>
                  <p className="text-sm text-green-600">Configure mTLS settings</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Istio Config</p>
                  <p className="text-sm text-purple-600">Manage configurations</p>
                </div>
              </button>
            </div>
          </div>

          {/* Service Status Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
            <div className="space-y-4">
              {[
                { name: 'productpage', status: 'healthy', replicas: '3/3', cpu: '45%' },
                { name: 'reviews-v1', status: 'healthy', replicas: '2/2', cpu: '32%' },
                { name: 'reviews-v2', status: 'warning', replicas: '2/3', cpu: '78%' },
                { name: 'details', status: 'healthy', replicas: '1/1', cpu: '23%' },
                { name: 'ratings', status: 'healthy', replicas: '1/1', cpu: '18%' }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.replicas} replicas</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{service.cpu}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Network Traffic */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Traffic</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateDynamicData.slice(-12)}>
                <defs>
                  <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.info} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="networkIn" 
                  stackId="1"
                  stroke={COLORS.info}
                  fill="url(#networkGradient)"
                  name="Inbound (MB/s)"
                />
                <Area 
                  type="monotone" 
                  dataKey="networkOut" 
                  stackId="1"
                  stroke={COLORS.secondary}
                  fill={COLORS.secondary}
                  fillOpacity={0.3}
                  name="Outbound (MB/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Connection Metrics */}
        <div className="bg-white rounded-2xl border  border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Connections</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateDynamicData.slice(-8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar 
                  dataKey="activeConnections" 
                  fill={COLORS.success}
                  radius={[4, 4, 0, 0]}
                  name="Active Connections"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateDynamicData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke={COLORS.warning}
                  strokeWidth={2}
                  name="Avg Latency"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="p95Latency" 
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  name="P95 Latency"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="p99Latency" 
                  stroke={COLORS.error}
                  strokeWidth={2}
                  name="P99 Latency"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{currentMetrics.uptime}%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{currentMetrics.totalServices}</p>
            <p className="text-sm text-gray-600">Total Services</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{currentMetrics.activeServices}</p>
            <p className="text-sm text-gray-600">Healthy Services</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {generateDynamicData[generateDynamicData.length - 1]?.activeConnections || 0}
            </p>
            <p className="text-sm text-gray-600">Active Connections</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {(generateDynamicData.reduce((sum, item) => sum + item.networkIn, 0) / 1024).toFixed(1)}GB
            </p>
            <p className="text-sm text-gray-600">Data Transferred</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'critical').length}
            </p>
            <p className="text-sm text-gray-600">Critical Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;