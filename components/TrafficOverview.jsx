'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Zap,
  Server,
  Users,
  Download,
  RefreshCw,
  Filter,
  Search,
  Globe,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Dynamically import Recharts components to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });

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

const TrafficOverviewPage = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('requests');

  // Generate dynamic data based on time range
  const generateTrafficData = (range) => {
    const dataPoints = range === '1h' ? 12 : range === '6h' ? 24 : range === '24h' ? 48 : 96;
    const timeUnit = range === '1h' ? 5 : range === '6h' ? 15 : range === '24h' ? 30 : 60;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const baseTime = Date.now() - (dataPoints - i) * timeUnit * 60 * 1000;
      const time = new Date(baseTime).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Simulate traffic patterns
      const hourOfDay = new Date(baseTime).getHours();
      const businessHourMultiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 1.5 : 0.8;
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      const baseRequests = 200 + Math.sin(i * 0.3) * 150;
      const requests = Math.round(baseRequests * businessHourMultiplier * randomFactor);
      const errors = Math.round(requests * (0.01 + Math.random() * 0.02));
      const latency = Math.round(120 + Math.sin(i * 0.4) * 40 + Math.random() * 30);
      const throughput = Math.round(requests * 0.8 + Math.random() * 50);
      
      return {
        time,
        timestamp: baseTime,
        requests,
        errors,
        latency,
        throughput,
        successRate: ((requests - errors) / requests * 100).toFixed(1)
      };
    });
  };

  const trafficData = useMemo(() => generateTrafficData(timeRange), [timeRange]);

  const metrics = [
    {
      id: 'requests',
      label: 'Total Requests',
      value: trafficData.reduce((sum, item) => sum + item.requests, 0).toLocaleString(),
      change: 12.5,
      icon: Activity,
      color: 'blue'
    },
    {
      id: 'errors',
      label: 'Error Rate',
      value: `${(trafficData.reduce((sum, item) => sum + item.errors, 0) / trafficData.reduce((sum, item) => sum + item.requests, 0) * 100).toFixed(2)}%`,
      change: -2.1,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'latency',
      label: 'Avg Latency',
      value: `${Math.round(trafficData.reduce((sum, item) => sum + item.latency, 0) / trafficData.length)}ms`,
      change: -5.3,
      icon: Clock,
      color: 'purple'
    },
    {
      id: 'throughput',
      label: 'Throughput',
      value: `${(trafficData.reduce((sum, item) => sum + item.throughput, 0) / 1000).toFixed(1)}K/min`,
      change: 8.7,
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const responseDistribution = [
    { name: '200 OK', value: 89.5, color: BRAND_COLORS.success },
    { name: '404 Not Found', value: 5.2, color: BRAND_COLORS.warning },
    { name: '500 Error', value: 3.1, color: BRAND_COLORS.error },
    { name: '403 Forbidden', value: 1.8, color: BRAND_COLORS.secondary },
    { name: 'Others', value: 0.4, color: '#6b7280' }
  ];

  const topEndpoints = [
    { endpoint: '/api/products', requests: 12500, errors: 25, latency: 145, trend: 'up' },
    { endpoint: '/api/users/{id}', requests: 9800, errors: 15, latency: 165, trend: 'down' },
    { endpoint: '/api/orders', requests: 8900, errors: 8, latency: 120, trend: 'up' },
    { endpoint: '/api/reviews/{id}', requests: 7200, errors: 12, latency: 135, trend: 'stable' },
    { endpoint: '/health', requests: 6500, errors: 0, latency: 45, trend: 'up' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const MetricCard = ({ metric }) => {
    const Icon = metric.icon;
    const isPositive = metric.change > 0;
    const isNegative = metric.change < 0;
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
           onClick={() => setSelectedMetric(metric.id)}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${
            metric.color === 'blue' ? 'from-blue-500/10 to-blue-600/20 text-blue-600' :
            metric.color === 'red' ? 'from-red-500/10 to-red-600/20 text-red-600' :
            metric.color === 'purple' ? 'from-purple-500/10 to-purple-600/20 text-purple-600' :
            'from-green-500/10 to-green-600/20 text-green-600'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isPositive ? <ArrowUp className="w-4 h-4" /> : 
             isNegative ? <ArrowDown className="w-4 h-4" /> : 
             <Minus className="w-4 h-4" />}
            <span>{Math.abs(metric.change)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="text-sm font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name === 'Success Rate' ? '%' : entry.name.includes('Latency') ? 'ms' : ''}`}
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
          <h1 className="text-3xl font-bold text-gray-900">Traffic Overview</h1>
          <p className="text-gray-600 mt-1">Monitor real-time traffic patterns and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Request Metrics Over Time</h3>
            <div className="flex items-center gap-2">
              <select 
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="requests">Requests</option>
                <option value="errors">Errors</option>
                <option value="latency">Latency</option>
                <option value="throughput">Throughput</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="errorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_COLORS.error} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={BRAND_COLORS.error} stopOpacity={0}/>
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
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={responseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {responseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {responseDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latency Distribution */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latency Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="latency" 
                fill={BRAND_COLORS.secondary}
                radius={[4, 4, 0, 0]}
                name="Latency (ms)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Endpoints Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Endpoints</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search endpoints..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Errors
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Latency
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topEndpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-blue-500 mr-3" />
                      <span className="text-sm font-medium text-gray-900 font-mono">{endpoint.endpoint}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {endpoint.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      endpoint.errors === 0 ? 'bg-green-100 text-green-800' : 
                      endpoint.errors > 20 ? 'bg-red-100 text-red-800' : 
                      endpoint.errors > 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {endpoint.errors}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {endpoint.latency}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-sm ${
                      endpoint.trend === 'up' ? 'text-green-600' : 
                      endpoint.trend === 'down' ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {endpoint.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : 
                       endpoint.trend === 'down' ? <ArrowDown className="w-4 h-4" /> : 
                       <Minus className="w-4 h-4" />}
                      <span className="capitalize">{endpoint.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrafficOverviewPage;