// src/components/analytics/CodePerformanceVisualizer.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Scatter, ScatterChart, ZAxis } from 'recharts';
import { 
  ChevronDown, ChevronUp, Filter, Download, RefreshCw,
  Code, Clock, Server, Zap, Activity, Cpu, HardDrive, Share2, 
  AlertCircle, CheckCircle, BarChart2
} from 'lucide-react';

// Custom hook for responsive design
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
};

// Custom Colors
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#8b5cf6',
  quaternary: '#f97316',
  warning: '#facc15',
  danger: '#ef4444',
  success: '#22c55e',
  blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  green: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  orange: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  gray: ['#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937'],
};

// Performance data for various languages
const generatePerformanceData = () => ({
  executionTime: [
    { name: 'C++', value: 1.2, color: CHART_COLORS.blue[0] },
    { name: 'Rust', value: 1.5, color: CHART_COLORS.orange[0] },
    { name: 'Go', value: 2.1, color: CHART_COLORS.blue[2] },
    { name: 'Java', value: 3.2, color: CHART_COLORS.orange[2] },
    { name: 'JavaScript', value: 5.8, color: CHART_COLORS.yellow },
    { name: 'Python', value: 8.5, color: CHART_COLORS.blue[4] },
    { name: 'Ruby', value: 9.7, color: CHART_COLORS.danger },
  ],
  
  memoryUsage: [
    { name: 'Rust', value: 3.2, color: CHART_COLORS.orange[0] },
    { name: 'C++', value: 3.8, color: CHART_COLORS.blue[0] },
    { name: 'Go', value: 4.5, color: CHART_COLORS.blue[2] },
    { name: 'Java', value: 22.5, color: CHART_COLORS.orange[2] },
    { name: 'Python', value: 15.8, color: CHART_COLORS.blue[4] },
    { name: 'JavaScript', value: 12.3, color: CHART_COLORS.yellow },
    { name: 'Ruby', value: 14.2, color: CHART_COLORS.danger },
  ],
  
  startupTime: [
    { name: 'C++', value: 0.001, color: CHART_COLORS.blue[0] },
    { name: 'Rust', value: 0.001, color: CHART_COLORS.orange[0] },
    { name: 'Go', value: 0.002, color: CHART_COLORS.blue[2] },
    { name: 'JavaScript', value: 0.05, color: CHART_COLORS.yellow },
    { name: 'Java', value: 0.8, color: CHART_COLORS.orange[2] },
    { name: 'Ruby', value: 0.2, color: CHART_COLORS.danger },
    { name: 'Python', value: 0.1, color: CHART_COLORS.blue[4] },
  ],
  
  throughput: [
    { name: 'C++', value: 950, color: CHART_COLORS.blue[0] },
    { name: 'Rust', value: 930, color: CHART_COLORS.orange[0] },
    { name: 'Go', value: 780, color: CHART_COLORS.blue[2] },
    { name: 'Java', value: 450, color: CHART_COLORS.orange[2] },
    { name: 'JavaScript', value: 320, color: CHART_COLORS.yellow },
    { name: 'Python', value: 120, color: CHART_COLORS.blue[4] },
    { name: 'Ruby', value: 95, color: CHART_COLORS.danger },
  ],
});

// Generate comparison data
const generateComparisonData = () => {
  const algorithms = [
    'Quick Sort', 'Merge Sort', 'Heap Sort', 'Binary Search', 
    'Breadth-First Search', 'Depth-First Search', 'Dijkstra'
  ];
  
  return algorithms.map(algo => {
    const complexities = {
      timeComplexity: Math.random() * 10,
      spaceComplexity: Math.random() * 10,
      scalability: Math.random() * 10,
      stability: Math.random() * 10,
      parallelizability: Math.random() * 10,
    };
    
    // Calculate efficiency score
    const efficiencyScore = Object.values(complexities).reduce((sum, val) => sum + val, 0) / 5;
    
    return {
      name: algo,
      ...complexities,
      efficiencyScore,
    };
  });
};

// Generate time series data
const generateTimeSeriesData = () => {
  const data = [];
  const languageData = {
    JavaScript: [120, 118, 110, 108, 115, 105, 95, 90, 87, 85, 82, 80],
    Python: [220, 210, 215, 218, 200, 195, 190, 185, 180, 175, 170, 168],
    Go: [50, 48, 47, 45, 42, 40, 39, 38, 37, 36, 35, 34],
    Rust: [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19],
  };
  
  for (let month = 0; month < 12; month++) {
    data.push({
      name: new Date(2025, month, 1).toLocaleString('default', { month: 'short' }),
      JavaScript: languageData.JavaScript[month],
      Python: languageData.Python[month],
      Go: languageData.Go[month],
      Rust: languageData.Rust[month],
    });
  }
  
  return data;
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center mt-1">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-gray-600 dark:text-gray-400 mr-2">
              {entry.name || entry.dataKey}:
            </span>
            <span className="font-semibold">
              {formatter 
                ? formatter(entry.value) 
                : typeof entry.value === 'number' 
                  ? entry.value.toFixed(2) 
                  : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

const CodePerformanceVisualizer = ({ languageFilter = null, metric = null }) => {
  const { darkMode } = useSelector(state => state.ui);
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('performance');
  const [performanceData, setPerformanceData] = useState(generatePerformanceData());
  const [comparisonData, setComparisonData] = useState(generateComparisonData());
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData());
  const [selectedMetric, setSelectedMetric] = useState(metric || 'executionTime');
  const [selectedLanguages, setSelectedLanguages] = useState(languageFilter || []);
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Filter data based on selected languages
  const filteredData = useMemo(() => {
    if (selectedLanguages.length === 0) {
      return performanceData[selectedMetric];
    }
    
    return performanceData[selectedMetric].filter(item => 
      selectedLanguages.includes(item.name)
    );
  }, [performanceData, selectedMetric, selectedLanguages]);
  
  // Theme colors
  const themeColors = {
    axisColor: darkMode ? '#94a3b8' : '#64748b',
    gridColor: darkMode ? '#334155' : '#e2e8f0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    textColor: darkMode ? '#f1f5f9' : '#0f172a',
  };
  
  // Metric formatters
  const metricFormatters = {
    executionTime: (value) => `${value} ms`,
    memoryUsage: (value) => `${value} MB`,
    startupTime: (value) => `${value} s`,
    throughput: (value) => `${value} req/s`,
  };
  
  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate data fetch
    setTimeout(() => {
      setPerformanceData(generatePerformanceData());
      setComparisonData(generateComparisonData());
      setTimeSeriesData(generateTimeSeriesData());
      setIsLoading(false);
    }, 800);
  };
  
  // Calculate optimal domain for chart
  const calculateYDomain = () => {
    if (filteredData.length === 0) return [0, 10];
    
    const values = filteredData.map(item => item.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.15;
    
    return [min > padding ? min - padding : 0, max + padding];
  };
  
  return (
    <div className="code-performance-visualizer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Code size={20} className="mr-2 text-primary" />
          Code Performance Insights
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className={`p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isLoading ? 'opacity-75 pointer-events-none' : ''
            }`}
            title="Refresh Data"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              showSettings ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            title="Chart Settings"
          >
            <Filter size={16} />
          </button>
          
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Export Data"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Performance Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="executionTime">Execution Time</option>
                <option value="memoryUsage">Memory Usage</option>
                <option value="startupTime">Startup Time</option>
                <option value="throughput">Throughput</option>
              </select>
            </div>
            
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="bar">Bar Chart</option>
                <option value="horizontalBar">Horizontal Bar</option>
                <option value="pie">Pie Chart</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>
            
            {/* Language Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Programming Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {performanceData[selectedMetric].map((item) => (
                  <label
                    key={item.name}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      selectedLanguages.includes(item.name)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedLanguages.includes(item.name)}
                      onChange={() => {
                        if (selectedLanguages.includes(item.name)) {
                          setSelectedLanguages(selectedLanguages.filter(lang => lang !== item.name));
                        } else {
                          setSelectedLanguages([...selectedLanguages, item.name]);
                        }
                      }}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'performance'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('performance')}
        >
          <div className="flex items-center">
            <Zap size={16} className="mr-1.5" />
            <span>Performance Comparison</span>
          </div>
        </button>
        
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'efficiency'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('efficiency')}
        >
          <div className="flex items-center">
            <Activity size={16} className="mr-1.5" />
            <span>Algorithm Efficiency</span>
          </div>
        </button>
        
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'trends'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('trends')}
        >
          <div className="flex items-center">
            <BarChart2 size={16} className="mr-1.5" />
            <span>Performance Trends</span>
          </div>
        </button>
      </div>
      
      {/* Chart Area */}
      <div className="p-4">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Updating data...</span>
            </div>
          </div>
        )}
        
        {/* Performance Comparison */}
        {activeTab === 'performance' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                {selectedMetric === 'executionTime' && (
                  <>
                    <Clock size={16} className="mr-1.5 text-primary" />
                    Execution Time Comparison (ms)
                  </>
                )}
                {selectedMetric === 'memoryUsage' && (
                  <>
                    <HardDrive size={16} className="mr-1.5 text-primary" />
                    Memory Usage Comparison (MB)
                  </>
                )}
                {selectedMetric === 'startupTime' && (
                  <>
                    <Cpu size={16} className="mr-1.5 text-primary" />
                    Startup Time Comparison (s)
                  </>
                )}
                {selectedMetric === 'throughput' && (
                  <>
                    <Server size={16} className="mr-1.5 text-primary" />
                    Throughput Comparison (requests/second)
                  </>
                )}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedMetric === 'executionTime' && (
                  'Comparing execution time for equivalent tasks across programming languages (lower is better)'
                )}
                {selectedMetric === 'memoryUsage' && (
                  'Comparing memory usage for equivalent tasks across programming languages (lower is better)'
                )}
                {selectedMetric === 'startupTime' && (
                  'Comparing application startup time across programming languages (lower is better)'
                )}
                {selectedMetric === 'throughput' && (
                  'Comparing request throughput capacity across programming languages (higher is better)'
                )}
              </p>
            </div>
            
            <div className="w-full h-64 md:h-80 relative">
              {filteredData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>No data to display</p>
                    <p className="text-sm mt-1">Please select at least one language</p>
                  </div>
                </div>
              ) : chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.gridColor} />
                    <XAxis 
                      dataKey="name" 
                      stroke={themeColors.axisColor}
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      stroke={themeColors.axisColor} 
                      domain={calculateYDomain()}
                      tickFormatter={(value) => {
                        if (selectedMetric === 'startupTime' && value < 0.01) {
                          return value.toExponential(1);
                        }
                        return value;
                      }}
                    />
                    <Tooltip 
                      content={<CustomTooltip formatter={metricFormatters[selectedMetric]} />} 
                      cursor={{ fill: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name={selectedMetric === 'executionTime' ? 'Execution Time' :
                            selectedMetric === 'memoryUsage' ? 'Memory Usage' :
                            selectedMetric === 'startupTime' ? 'Startup Time' : 'Throughput'}
                      fill={CHART_COLORS.primary}
                    >
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : chartType === 'horizontalBar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={filteredData}
                    margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.gridColor} />
                    <XAxis 
                      type="number" 
                      stroke={themeColors.axisColor}
                      domain={calculateYDomain()}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name" 
                      stroke={themeColors.axisColor}
                      tick={{ fontSize: 12 }}
                      width={70}
                    />
                    <Tooltip 
                      content={<CustomTooltip formatter={metricFormatters[selectedMetric]} />} 
                      cursor={{ fill: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name={selectedMetric === 'executionTime' ? 'Execution Time' :
                            selectedMetric === 'memoryUsage' ? 'Memory Usage' :
                            selectedMetric === 'startupTime' ? 'Startup Time' : 'Throughput'}
                      fill={CHART_COLORS.primary}
                    >
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : chartType === 'pie' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 80 : 120}
                      innerRadius={isMobile ? 40 : 60}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: themeColors.axisColor, strokeWidth: 1 }}
                    >
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip formatter={metricFormatters[selectedMetric]} />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : chartType === 'radar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? 80 : 120} data={filteredData}>
                    <PolarGrid stroke={themeColors.gridColor} />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: themeColors.axisColor, fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={30} domain={calculateYDomain()} stroke={themeColors.axisColor} />
                    <Radar
                      name={selectedMetric === 'executionTime' ? 'Execution Time' :
                            selectedMetric === 'memoryUsage' ? 'Memory Usage' :
                            selectedMetric === 'startupTime' ? 'Startup Time' : 'Throughput'}
                      dataKey="value"
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.6}
                    />
                    <Tooltip content={<CustomTooltip formatter={metricFormatters[selectedMetric]} />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        )}
        
        {/* Algorithm Efficiency */}
        {activeTab === 'efficiency' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Activity size={16} className="mr-1.5 text-primary" />
                Algorithm Efficiency Analysis
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Comparing different algorithms across multiple efficiency metrics (higher is better)
              </p>
            </div>
            
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={isMobile ? 80 : 130} 
                  data={comparisonData}
                >
                  <PolarGrid stroke={themeColors.gridColor} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: themeColors.axisColor, fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    stroke={themeColors.axisColor}
                  />
                  <Radar
                    name="Time Complexity"
                    dataKey="timeComplexity"
                    stroke={CHART_COLORS.blue[0]}
                    fill={CHART_COLORS.blue[0]}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Space Complexity"
                    dataKey="spaceComplexity"
                    stroke={CHART_COLORS.green[0]}
                    fill={CHART_COLORS.green[0]}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Scalability"
                    dataKey="scalability"
                    stroke={CHART_COLORS.purple[0]}
                    fill={CHART_COLORS.purple[0]}
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Algorithm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time Complexity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Space Complexity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Scalability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Efficiency Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {comparisonData
                    .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
                    .map((algorithm, index) => (
                      <tr key={algorithm.name} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {algorithm.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {algorithm.timeComplexity.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {algorithm.spaceComplexity.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {algorithm.scalability.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{ 
                                  width: `${algorithm.efficiencyScore * 10}%`,
                                  backgroundColor: `hsl(${120 * (algorithm.efficiencyScore / 10)}, 70%, 45%)`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {algorithm.efficiencyScore.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Performance Trends */}
        {activeTab === 'trends' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <BarChart2 size={16} className="mr-1.5 text-primary" />
                Performance Improvement Trends
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Average execution time (ms) trend over the past 12 months (lower is better)
              </p>
            </div>
            
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={themeColors.gridColor} />
                  <XAxis 
                    dataKey="name" 
                    stroke={themeColors.axisColor}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke={themeColors.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: themeColors.backgroundColor }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="JavaScript"
                    stroke={CHART_COLORS.orange[0]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Python"
                    stroke={CHART_COLORS.blue[0]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Go"
                    stroke={CHART_COLORS.blue[3]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Rust"
                    stroke={CHART_COLORS.orange[3]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries({
                JavaScript: { color: CHART_COLORS.orange[0], improvement: 33.3 },
                Python: { color: CHART_COLORS.blue[0], improvement: 23.6 },
                Go: { color: CHART_COLORS.blue[3], improvement: 32.0 },
                Rust: { color: CHART_COLORS.orange[3], improvement: 36.7 },
              }).map(([language, data]) => (
                <div 
                  key={language}
                  className="flex flex-col p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language}
                    </h5>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    ></div>
                  </div>
                  <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {data.improvement}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Performance improvement in 12 months
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${data.improvement}%`,
                        backgroundColor: data.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePerformanceVisualizer;