import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  ChevronDown, ChevronUp, BarChart2, Activity, PieChart as PieChartIcon,
  Share2, Download, RefreshCw, Info, Target, HelpCircle, Code, 
  Check, Clock, Cpu, HardDrive, Zap, Maximize2, List, Grid
} from 'lucide-react';

const CodePerformanceVisualizer = ({
  title = 'Performance Comparison',
  description = 'Compare performance metrics between different code implementations',
  metrics = [
    {
      id: 'implementation1',
      name: 'Implementation 1',
      executionTime: 120,
      memoryUsage: 8.2,
      complexity: 'O(n²)',
      description: 'Initial implementation using nested loops',
      color: '#4149eb',
      linesOfCode: 42,
      testCaseResults: [
        { input: 'Small', time: 10, memory: 3.1 },
        { input: 'Medium', time: 120, memory: 8.2 },
        { input: 'Large', time: 750, memory: 15.8 }
      ]
    },
    {
      id: 'implementation2',
      name: 'Implementation 2',
      executionTime: 45,
      memoryUsage: 6.8,
      complexity: 'O(n log n)',
      description: 'Optimized version using divide and conquer',
      color: '#22c973',
      linesOfCode: 68,
      testCaseResults: [
        { input: 'Small', time: 5, memory: 2.8 },
        { input: 'Medium', time: 45, memory: 6.8 },
        { input: 'Large', time: 280, memory: 13.5 }
      ]
    },
    {
      id: 'implementation3',
      name: 'Implementation 3',
      executionTime: 15,
      memoryUsage: 12.4,
      complexity: 'O(n)',
      description: 'Highly optimized using hash map',
      color: '#f83b3b',
      linesOfCode: 75,
      testCaseResults: [
        { input: 'Small', time: 2, memory: 5.4 },
        { input: 'Medium', time: 15, memory: 12.4 },
        { input: 'Large', time: 35, memory: 24.8 }
      ]
    }
  ],
  chartType = 'bar',
  dataType = 'executionTime',
  layout = 'vertical',
  isCollapsible = true,
  showLegend = true,
  showDataLabels = true,
  showTestCases = true,
  testCaseView = 'chart',
  defaultExpanded = true,
  theme = 'light'
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [selectedDataType, setSelectedDataType] = useState(dataType);
  const [selectedLayout, setSelectedLayout] = useState(layout);
  const [selectedTestCaseView, setSelectedTestCaseView] = useState(testCaseView);
  const [isLoading, setIsLoading] = useState(false);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(null);
  
  // Get data for current selected data type
  const getChartData = () => {
    return metrics.map(metric => ({
      name: metric.name,
      value: metric[selectedDataType],
      color: metric.color,
      id: metric.id
    }));
  };
  
  // Get data for scatter plot
  const getScatterData = () => {
    return metrics.map(metric => ({
      name: metric.name,
      executionTime: metric.executionTime,
      memoryUsage: metric.memoryUsage,
      linesOfCode: metric.linesOfCode,
      color: metric.color,
      id: metric.id
    }));
  };
  
  // Get radar chart data
  const getRadarData = () => {
    // Normalize data to have comparable scales
    const maxTime = Math.max(...metrics.map(m => m.executionTime));
    const maxMemory = Math.max(...metrics.map(m => m.memoryUsage));
    const maxLines = Math.max(...metrics.map(m => m.linesOfCode));
    
    const radarData = [
      { subject: 'Speed', fullMark: 100 },
      { subject: 'Memory', fullMark: 100 },
      { subject: 'Code Size', fullMark: 100 },
      { subject: 'Readability', fullMark: 100 },
      { subject: 'Maintainability', fullMark: 100 }
    ];
    
    // Add values for each implementation
    metrics.forEach(metric => {
      radarData[0][metric.id] = 100 - ((metric.executionTime / maxTime) * 100); // Speed (inverted)
      radarData[1][metric.id] = 100 - ((metric.memoryUsage / maxMemory) * 100); // Memory (inverted)
      radarData[2][metric.id] = 100 - ((metric.linesOfCode / maxLines) * 100); // Code Size (inverted)
      
      // Randomize readability and maintainability for demo
      // In a real app, these would come from actual metrics
      radarData[3][metric.id] = Math.floor(Math.random() * 40) + 60; // Readability
      radarData[4][metric.id] = Math.floor(Math.random() * 40) + 60; // Maintainability
    });
    
    return radarData;
  };
  
  // Get test case data
  const getTestCaseData = () => {
    const data = [];
    
    metrics[0].testCaseResults.forEach((testCase, index) => {
      const entry = { name: testCase.input };
      
      metrics.forEach(metric => {
        entry[metric.id] = metric.testCaseResults[index][selectedDataType];
        entry[`${metric.id}Color`] = metric.color;
      });
      
      data.push(entry);
    });
    
    return data;
  };
  
  // Get test case table data
  const getTestCaseTableData = () => {
    return metrics[0].testCaseResults.map((testCase, index) => {
      const row = { input: testCase.input };
      
      metrics.forEach(metric => {
        row[`${metric.id}_time`] = metric.testCaseResults[index].time;
        row[`${metric.id}_memory`] = metric.testCaseResults[index].memory;
      });
      
      return row;
    });
  };
  
  // Format data value based on type
  const formatValue = (value, type) => {
    switch (type) {
      case 'executionTime':
        return `${value} ms`;
      case 'memoryUsage':
        return `${value} MB`;
      case 'linesOfCode':
        return value;
      default:
        return value;
    }
  };
  
  // Get label for data type
  const getDataTypeLabel = (type) => {
    switch (type) {
      case 'executionTime':
        return 'Execution Time';
      case 'memoryUsage':
        return 'Memory Usage';
      case 'linesOfCode':
        return 'Lines of Code';
      default:
        return type;
    }
  };
  
  // Get icon for data type
  const getDataTypeIcon = (type) => {
    switch (type) {
      case 'executionTime':
        return <Clock className="h-4 w-4" />;
      case 'memoryUsage':
        return <HardDrive className="h-4 w-4" />;
      case 'linesOfCode':
        return <Code className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get color for complexity
  const getComplexityColor = (complexity) => {
    if (complexity.includes('1)') || complexity.includes('log n)')) {
      return 'text-success-600 bg-success-50 border-success-200';
    } else if (complexity.includes('n)')) {
      return 'text-primary-600 bg-primary-50 border-primary-200';
    } else if (complexity.includes('n²)') || complexity.includes('n^2)')) {
      return 'text-warning-600 bg-warning-50 border-warning-200';
    } else {
      return 'text-error-600 bg-error-50 border-error-200';
    }
  };
  
  // Simulate refreshing data
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };
  
  // Generate custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-sm">
          <p className="text-sm font-medium text-neutral-900">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${getDataTypeLabel(selectedDataType)}: ${formatValue(entry.value, selectedDataType)}`}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  // Generate custom tooltip for radar chart
  const RadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-sm">
          <p className="text-sm font-medium text-neutral-900">{payload[0].payload.subject}</p>
          {payload.map((entry, index) => {
            const metric = metrics.find(m => m.id === entry.dataKey);
            if (!metric) return null;
            
            return (
              <p key={index} className="text-sm" style={{ color: metric.color }}>
                {`${metric.name}: ${Math.round(entry.value)}/100`}
              </p>
            );
          })}
        </div>
      );
    }
    
    return null;
  };
  
  // Render the appropriate chart based on selected type
  const renderChart = () => {
    const data = getChartData();
    
    switch (selectedChartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout={selectedLayout}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {selectedLayout === 'horizontal' ? (
                <>
                  <XAxis dataKey="name" />
                  <YAxis 
                    label={{ 
                      value: getDataTypeLabel(selectedDataType), 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    type="number" 
                    label={{ 
                      value: getDataTypeLabel(selectedDataType), 
                      position: 'insideBottom',
                      offset: -5
                    }} 
                  />
                  <YAxis dataKey="name" type="category" />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar
                dataKey="value"
                name={getDataTypeLabel(selectedDataType)}
                label={showDataLabels ? {
                  position: selectedLayout === 'horizontal' ? 'top' : 'right',
                  content: (props) => {
                    const { x, y, width, height, value } = props;
                    const posX = selectedLayout === 'horizontal' ? x + width / 2 : x + width + 5;
                    const posY = selectedLayout === 'horizontal' ? y - 10 : y + height / 2;
                    
                    return (
                      <text
                        x={posX}
                        y={posY}
                        fill="#666"
                        textAnchor={selectedLayout === 'horizontal' ? 'middle' : 'start'}
                        dominantBaseline="middle"
                        fontSize={12}
                      >
                        {formatValue(value, selectedDataType)}
                      </text>
                    );
                  }
                } : false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ 
                  value: getDataTypeLabel(selectedDataType), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                name={getDataTypeLabel(selectedDataType)}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                label={showDataLabels ? {
                  position: 'top',
                  content: (props) => {
                    const { x, y, value } = props;
                    return (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#666"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                      >
                        {formatValue(value, selectedDataType)}
                      </text>
                    );
                  }
                } : false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} stroke={entry.color} />
                ))}
              </Line>
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={showDataLabels ? {
                  fill: '#666',
                  fontSize: 12,
                  position: 'outside',
                  content: (props) => {
                    const { name, value } = props;
                    return `${name}: ${formatValue(value, selectedDataType)}`;
                  }
                } : false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="80%" 
              data={getRadarData()}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {metrics.map((metric) => (
                <Radar
                  key={metric.id}
                  name={metric.name}
                  dataKey={metric.id}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.2}
                />
              ))}
              <Tooltip content={<RadarTooltip />} />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        const scatterData = getScatterData();
        return (
          <ResponsiveContainer width="100%" height={350}>
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-6 bg-neutral-100 rounded-lg">
                <Target className="h-12 w-12 mx-auto text-primary-400 mb-3" />
                <h3 className="text-lg font-medium text-neutral-800 mb-2">Scatter Plot Unavailable</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  This chart type requires more data points for meaningful visualization.
                </p>
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={() => setSelectedChartType('bar')}
                >
                  Switch to Bar Chart
                </button>
              </div>
            </div>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex justify-center items-center h-64">
            <div className="text-center p-6">
              <HelpCircle className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Chart Type Not Supported</h3>
              <p className="text-neutral-600 text-sm">
                The selected chart type is not supported. Please choose another type.
              </p>
            </div>
          </div>
        );
    }
  };
  
  // Render test case visualization
  const renderTestCaseVisualization = () => {
    if (!showTestCases) return null;
    
    const testCaseData = getTestCaseData();
    
    if (selectedTestCaseView === 'chart') {
      return (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Performance Across Test Cases
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={testCaseData}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ 
                  value: getDataTypeLabel(selectedDataType), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip />
              <Legend />
              {metrics.map((metric) => (
                <Bar
                  key={metric.id}
                  dataKey={metric.id}
                  name={metric.name}
                  fill={metric.color}
                  label={showDataLabels ? {
                    position: 'top',
                    content: (props) => {
                      const { x, y, width, value } = props;
                      return (
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          fill="#666"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={11}
                        >
                          {formatValue(value, selectedDataType)}
                        </text>
                      );
                    }
                  } : false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else {
      const tableData = getTestCaseTableData();
      
      return (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Performance Across Test Cases
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 border rounded-lg">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Test Case
                  </th>
                  {metrics.map((metric) => (
                    <React.Fragment key={metric.id}>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                        style={{ color: metric.color }}
                      >
                        {metric.name} Time
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                        style={{ color: metric.color }}
                      >
                        {metric.name} Memory
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {tableData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {row.input}
                    </td>
                    {metrics.map((metric) => (
                      <React.Fragment key={metric.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {formatValue(row[`${metric.id}_time`], 'executionTime')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {formatValue(row[`${metric.id}_memory`], 'memoryUsage')}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className={`code-performance-visualizer border rounded-lg shadow-soft ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'} flex items-center justify-between`}>
        <div className="flex-1">
          <button 
            className={`flex items-center text-lg font-semibold ${theme === 'dark' ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-700'}`}
            onClick={() => isCollapsible && setExpanded(!expanded)}
            disabled={!isCollapsible}
          >
            {isCollapsible && (
              expanded ? (
                <ChevronUp className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 mr-2 flex-shrink-0" />
              )
            )}
            <span>{title}</span>
          </button>
          {description && (
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Chart type selector */}
          <div className="relative group">
            <button className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`} title="Change chart type">
              {selectedChartType === 'bar' && <BarChart2 className="h-4 w-4" />}
              {selectedChartType === 'line' && <Activity className="h-4 w-4" />}
              {selectedChartType === 'pie' && <PieChartIcon className="h-4 w-4" />}
              {selectedChartType === 'radar' && <Target className="h-4 w-4" />}
              {selectedChartType === 'scatter' && <Grid className="h-4 w-4" />}
            </button>
            
            <div className={`absolute right-0 mt-1 hidden group-hover:block border rounded-md shadow-lg z-10 p-1 grid grid-cols-3 gap-1 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
              <button
                className={`p-1.5 rounded ${
                  selectedChartType === 'bar' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setSelectedChartType('bar')}
                title="Bar Chart"
              >
                <BarChart2 className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  selectedChartType === 'line' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setSelectedChartType('line')}
                title="Line Chart"
              >
                <Activity className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  selectedChartType === 'pie' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setSelectedChartType('pie')}
                title="Pie Chart"
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  selectedChartType === 'radar' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setSelectedChartType('radar')}
                title="Radar Chart"
              >
                <Target className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  selectedChartType === 'scatter' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setSelectedChartType('scatter')}
                title="Scatter Plot"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Data type selector */}
          {selectedChartType !== 'radar' && (
            <div className="relative group">
              <button className={`flex items-center p-1.5 rounded text-sm ${theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}>
                {getDataTypeIcon(selectedDataType)}
              </button>
              
              <div className={`absolute right-0 mt-1 hidden group-hover:block border rounded-md shadow-lg z-10 w-40 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                <div className="py-1">
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      selectedDataType === 'executionTime' 
                        ? theme === 'dark' 
                          ? 'bg-neutral-700 text-white' 
                          : 'bg-neutral-100 text-neutral-900'
                        : theme === 'dark' 
                          ? 'text-neutral-300 hover:bg-neutral-700' 
                          : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                    onClick={() => setSelectedDataType('executionTime')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Execution Time
                  </button>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      selectedDataType === 'memoryUsage' 
                        ? theme === 'dark' 
                          ? 'bg-neutral-700 text-white' 
                          : 'bg-neutral-100 text-neutral-900'
                        : theme === 'dark' 
                          ? 'text-neutral-300 hover:bg-neutral-700' 
                          : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                    onClick={() => setSelectedDataType('memoryUsage')}
                  >
                    <HardDrive className="h-4 w-4 mr-2" />
                    Memory Usage
                  </button>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      selectedDataType === 'linesOfCode' 
                        ? theme === 'dark' 
                          ? 'bg-neutral-700 text-white' 
                          : 'bg-neutral-100 text-neutral-900'
                        : theme === 'dark' 
                          ? 'text-neutral-300 hover:bg-neutral-700' 
                          : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                    onClick={() => setSelectedDataType('linesOfCode')}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Lines of Code
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Layout selector (for bar charts) */}
          {selectedChartType === 'bar' && (
            <div className="relative group">
              <button className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`} title="Change layout">
                {selectedLayout === 'horizontal' ? (
                  <BarChart2 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </button>
              
              <div className={`absolute right-0 mt-1 hidden group-hover:block border rounded-md shadow-lg z-10 p-1 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                <button
                  className={`p-1.5 rounded ${
                    selectedLayout === 'horizontal' 
                      ? theme === 'dark' 
                        ? 'bg-neutral-700 text-white' 
                        : 'bg-neutral-200 text-neutral-900'
                      : theme === 'dark' 
                        ? 'text-neutral-300 hover:bg-neutral-700' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedLayout('horizontal')}
                  title="Horizontal Layout"
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
                
                <button
                  className={`p-1.5 rounded ${
                    selectedLayout === 'vertical' 
                      ? theme === 'dark' 
                        ? 'bg-neutral-700 text-white' 
                        : 'bg-neutral-200 text-neutral-900'
                      : theme === 'dark' 
                        ? 'text-neutral-300 hover:bg-neutral-700' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedLayout('vertical')}
                  title="Vertical Layout"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Test case view selector */}
          {showTestCases && (
            <div className="relative group">
              <button 
                className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}
                title="Test case view"
              >
                {selectedTestCaseView === 'chart' ? (
                  <BarChart2 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </button>
              
              <div className={`absolute right-0 mt-1 hidden group-hover:block border rounded-md shadow-lg z-10 p-1 ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                <button
                  className={`p-1.5 rounded ${
                    selectedTestCaseView === 'chart' 
                      ? theme === 'dark' 
                        ? 'bg-neutral-700 text-white' 
                        : 'bg-neutral-200 text-neutral-900'
                      : theme === 'dark' 
                        ? 'text-neutral-300 hover:bg-neutral-700' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedTestCaseView('chart')}
                  title="Chart View"
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
                
                <button
                  className={`p-1.5 rounded ${
                    selectedTestCaseView === 'table' 
                      ? theme === 'dark' 
                        ? 'bg-neutral-700 text-white' 
                        : 'bg-neutral-200 text-neutral-900'
                      : theme === 'dark' 
                        ? 'text-neutral-300 hover:bg-neutral-700' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedTestCaseView('table')}
                  title="Table View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Refresh button */}
          <button 
            className={`p-1.5 rounded ${
              isLoading 
                ? theme === 'dark' 
                  ? 'animate-spin text-primary-400' 
                  : 'animate-spin text-primary-600'
                : theme === 'dark' 
                  ? 'hover:bg-neutral-800 text-neutral-300' 
                  : 'hover:bg-neutral-100 text-neutral-600'
            }`}
            onClick={refreshData}
            disabled={isLoading}
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          {/* Export button */}
          <button 
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      {expanded && (
        <div className={`p-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`animate-pulse flex flex-col items-center ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <RefreshCw className="h-10 w-10 animate-spin mb-2" />
                <span className="text-sm">Loading performance data...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Implementation summary */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div 
                    key={metric.id}
                    className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50'} border ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'}`}
                    style={{ borderLeftColor: metric.color, borderLeftWidth: '4px' }}
                  >
                    <div className={`flex items-start justify-between ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                      <h3 className="text-lg font-semibold">{metric.name}</h3>
                      <div className="relative" onMouseEnter={() => setInfoTooltipOpen(index)} onMouseLeave={() => setInfoTooltipOpen(null)}>
                        <Info className={`h-4 w-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        
                        {infoTooltipOpen === index && (
                          <div className={`absolute right-0 w-56 p-3 rounded-lg shadow-lg z-10 text-sm ${theme === 'dark' ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' : 'bg-white text-neutral-700 border border-neutral-200'}`}>
                            <div className="mb-2 font-medium">{metric.name}</div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              {metric.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Execution Time
                        </div>
                        <div className={`font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                          <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                          {formatValue(metric.executionTime, 'executionTime')}
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Memory Usage
                        </div>
                        <div className={`font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                          <HardDrive className="h-4 w-4 mr-1 text-neutral-400" />
                          {formatValue(metric.memoryUsage, 'memoryUsage')}
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Complexity
                        </div>
                        <div className={`font-mono text-sm px-2 py-0.5 rounded inline-flex items-center border ${getComplexityColor(metric.complexity)}`}>
                          {metric.complexity}
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Lines of Code
                        </div>
                        <div className={`font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                          <Code className="h-4 w-4 mr-1 text-neutral-400" />
                          {metric.linesOfCode}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Main chart */}
              {renderChart()}
              
              {/* Test case visualization */}
              {renderTestCaseVisualization()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CodePerformanceVisualizer;