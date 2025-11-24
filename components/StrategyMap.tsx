
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { StrategyMapData, StrategyNode, StrategyEdge } from '../types';
import { Network, Download, RefreshCw, Map as MapIcon, MousePointer2, Link as LinkIcon, Globe, Box, Settings, DollarSign, ShieldAlert, Zap, Save, FolderOpen, Check } from 'lucide-react';

interface StrategyMapProps {
  data: StrategyMapData | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const StrategyMap: React.FC<StrategyMapProps> = ({ data, onGenerate, isLoading }) => {
  const [nodes, setNodes] = useState<StrategyNode[]>([]);
  const [edges, setEdges] = useState<StrategyEdge[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // Interaction State
  const [mode, setMode] = useState<'move' | 'connect'>('move');
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{x: number, y: number} | null>(null);
  
  // Save/Load State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
    }
  }, [data]);

  // Reset interaction states when switching modes
  useEffect(() => {
    setConnectingNodeId(null);
    setDraggingId(null);
    setCursorPos(null);
  }, [mode]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (mode === 'move') {
      setDraggingId(id);
    } else if (mode === 'connect') {
      if (connectingNodeId === null) {
        setConnectingNodeId(id);
        // Set initial cursor pos to the node center to avoid jumping
        const node = nodes.find(n => n.id === id);
        if (node) setCursorPos({ x: node.x, y: node.y });
      } else {
        // If clicking a different node, create connection
        if (connectingNodeId !== id) {
            // Check if edge already exists
            const exists = edges.some(e => e.from === connectingNodeId && e.to === id);
            if (!exists) {
                setEdges(prev => [...prev, { from: connectingNodeId, to: id }]);
            }
        }
        setConnectingNodeId(null);
        setCursorPos(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        // Calculate mouse position in SVG coordinates
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;
        
        // Handle Dragging
        if (mode === 'move' && draggingId) {
          setNodes((prev) => prev.map(n => 
            n.id === draggingId ? { ...n, x, y } : n
          ));
        }

        // Handle Connector Rubber Banding
        if (mode === 'connect' && connectingNodeId) {
            setCursorPos({ x, y });
        }
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleBackgroundClick = () => {
      setConnectingNodeId(null);
      setCursorPos(null);
  };

  const handleEdgeClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (mode === 'connect') return;

    const currentEdge = edges[index];
    const newLabel = window.prompt("Label this connection (e.g., 'Flows To', 'Depends On'):", currentEdge.label || "");
    
    if (newLabel !== null) {
        setEdges(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], label: newLabel };
            return copy;
        });
    }
  };

  const getNodeColor = (category: string) => {
    switch (category) {
      case 'Market': return '#0891b2'; // Cyan-600
      case 'Product': return '#7c3aed'; // Violet-600
      case 'Operation': return '#475569'; // Slate-600
      case 'Finance': return '#059669'; // Emerald-600
      case 'Risk': return '#dc2626'; // Red-600
      default: return '#4b5563';
    }
  };

  const getNodeIcon = (category: string) => {
      const props = { width: 14, height: 14, stroke: "white", strokeWidth: 3 };
      switch (category) {
        case 'Market': return <Globe {...props} />;
        case 'Product': return <Box {...props} />;
        case 'Operation': return <Settings {...props} />;
        case 'Finance': return <DollarSign {...props} />;
        case 'Risk': return <ShieldAlert {...props} />;
        default: return <Zap {...props} />;
      }
  };

  const handleExport = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'strategy-map.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
      const stateToSave = { nodes, edges };
      localStorage.setItem('solopreneur_strategy_map', JSON.stringify(stateToSave));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLoad = () => {
      const savedData = localStorage.getItem('solopreneur_strategy_map');
      if (savedData) {
          try {
              const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
              setNodes(savedNodes);
              setEdges(savedEdges);
          } catch (e) {
              console.error("Failed to load strategy map", e);
          }
      }
  };

  // Helper to draw curved path
  const getPath = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = Math.abs(x2 - x1) * 0.5;
      // Ensure a minimum curve even if vertically aligned
      const controlOffset = Math.max(dx, 50); 
      return `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-before-page">
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950">
          <div>
             <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Network className="w-5 h-5 text-cyan-600" />
                Interactive Strategy Map
             </h2>
             <p className="text-slate-500 text-sm mt-1">
                {mode === 'connect' 
                    ? "Click a node, then click another to connect." 
                    : "Drag nodes to organize. Click a line to label it."}
             </p>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Interaction Toolbar */}
            {nodes.length > 0 && (
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setMode('move')}
                        className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${mode === 'move' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title="Move Mode"
                    >
                        <MousePointer2 className="w-4 h-4" /> Move
                    </button>
                    <button
                        onClick={() => setMode('connect')}
                        className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${mode === 'connect' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title="Connect Mode"
                    >
                        <LinkIcon className="w-4 h-4" /> Connect
                    </button>
                </div>
            )}

            {/* Storage Toolbar */}
            {nodes.length > 0 && (
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                     <button 
                        onClick={handleSave}
                        className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${saveStatus === 'saved' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        title="Save Layout"
                    >
                        {saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    </button>
                     <button 
                        onClick={handleLoad}
                        className="p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Load Saved Layout"
                    >
                        <FolderOpen className="w-4 h-4" />
                    </button>
                </div>
            )}

            {nodes.length > 0 && (
                <button 
                    onClick={handleExport}
                    className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    title="Export to SVG"
                >
                    <Download className="w-5 h-5" />
                </button>
            )}
            {!data && !isLoading && (
                <button 
                    onClick={onGenerate}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-cyan-500/20"
                >
                    Generate Map
                </button>
            )}
          </div>
        </div>

        {/* Canvas Container */}
        <div 
            className={`w-full h-[600px] bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden select-none ${mode === 'move' ? 'cursor-move' : 'cursor-crosshair'}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleBackgroundClick}
        >   
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20" 
                 style={{ 
                     backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', 
                     backgroundSize: '24px 24px' 
                 }} 
            />

            {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <RefreshCw className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
                    <p className="text-slate-500 animate-pulse font-bold">Architecting business system...</p>
                </div>
            ) : nodes.length === 0 && !isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-50 pointer-events-none">
                    <MapIcon className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-4" />
                    <p className="text-slate-400 font-medium">Generate a map to visualize system dynamics.</p>
                    <div className="mt-4 flex gap-2 pointer-events-auto">
                        <button onClick={handleLoad} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700">
                            Load Previous Map
                        </button>
                    </div>
                </div>
            ) : (
                <svg 
                    ref={svgRef}
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 800 600" 
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
                        </marker>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                           <feGaussianBlur stdDeviation="3" result="blur" />
                           <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        
                        {/* Node Gradients */}
                        <linearGradient id="grad-Market" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                        <linearGradient id="grad-Product" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="grad-Operation" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                        <linearGradient id="grad-Finance" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                         <linearGradient id="grad-Risk" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                    </defs>

                    {/* Rubber Band Line (Active Connection) */}
                    {mode === 'connect' && connectingNodeId && cursorPos && (() => {
                         const startNode = nodes.find(n => n.id === connectingNodeId);
                         if (!startNode) return null;
                         return (
                             <path 
                                 d={getPath(startNode.x, startNode.y, cursorPos.x, cursorPos.y)}
                                 fill="none"
                                 stroke="#64748b" 
                                 strokeWidth="2" 
                                 strokeDasharray="5,5"
                                 markerEnd="url(#arrowhead)"
                                 opacity="0.6"
                                 className="pointer-events-none"
                             />
                         );
                    })()}

                    {/* Existing Edges */}
                    {edges.map((edge, i) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const pathString = getPath(fromNode.x, fromNode.y, toNode.x, toNode.y);
                        const midX = (fromNode.x + toNode.x) / 2;
                        const midY = (fromNode.y + toNode.y) / 2;

                        return (
                            <g 
                                key={`edge-${i}`} 
                                onClick={(e) => handleEdgeClick(e, i)}
                                className="group cursor-pointer"
                            >
                                {/* Invisible Hit Area for easier clicking */}
                                <path 
                                    d={pathString}
                                    fill="none"
                                    stroke="transparent" 
                                    strokeWidth="20" 
                                    className="pointer-events-auto"
                                />

                                {/* Visible Line */}
                                <path 
                                    d={pathString}
                                    fill="none"
                                    stroke="#64748b" 
                                    strokeWidth="2" 
                                    markerEnd="url(#arrowhead)"
                                    opacity="0.4"
                                    className="group-hover:stroke-cyan-500 group-hover:opacity-100 transition-all duration-300"
                                />
                                {/* Styles specifically for hover effect to switch marker */}
                                <style>{`
                                    .group:hover path[marker-end="url(#arrowhead)"] {
                                        marker-end: url(#arrowhead-active);
                                    }
                                `}</style>

                                {/* Label */}
                                <foreignObject 
                                    x={midX - 40} 
                                    y={midY - 12} 
                                    width="80" 
                                    height="24"
                                    className="overflow-visible pointer-events-none" 
                                >
                                    <div className="flex items-center justify-center w-full h-full">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded border shadow-sm truncate transition-all duration-300 ${
                                            edge.label 
                                                ? 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-600'
                                                : 'bg-cyan-100 text-cyan-700 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 border-cyan-200 shadow-cyan-500/20'
                                        }`}>
                                            {edge.label || "+ Label"}
                                        </span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isConnecting = connectingNodeId === node.id;
                        const isDragging = draggingId === node.id;
                        
                        return (
                            <g 
                                key={node.id} 
                                transform={`translate(${node.x},${node.y})`}
                                onMouseDown={(e) => handleMouseDown(e, node.id)}
                                className={`${mode === 'move' ? 'cursor-move' : 'cursor-pointer'} transition-all duration-200`}
                                style={{ opacity: (connectingNodeId && !isConnecting) ? 0.6 : 1 }}
                            >
                                {/* Halo for connection mode */}
                                {isConnecting && (
                                     <circle r="35" fill="none" stroke={getNodeColor(node.category)} strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />
                                )}

                                {/* Shadow */}
                                <circle r="20" fill="black" opacity="0.2" transform="translate(0, 4)" />
                                
                                {/* Main Node Body */}
                                <circle 
                                    r="22" 
                                    fill={`url(#grad-${node.category})`}
                                    stroke="white"
                                    strokeWidth={isDragging ? 3 : 1}
                                    filter={isDragging ? "url(#glow)" : ""}
                                />

                                {/* Icon */}
                                <foreignObject x="-7" y="-7" width="14" height="14" pointerEvents="none">
                                    <div className="flex items-center justify-center h-full w-full">
                                        {getNodeIcon(node.category)}
                                    </div>
                                </foreignObject>
                                
                                {/* Label Background */}
                                <rect 
                                    x="-50" y="30" width="100" height="24" rx="6" 
                                    fill={isDragging ? '#fff' : '#1e293b'} 
                                    stroke={getNodeColor(node.category)}
                                    strokeWidth={isDragging ? 2 : 0}
                                    className="transition-colors duration-200"
                                    opacity="0.9"
                                />
                                
                                {/* Label Text */}
                                <text 
                                    y="45" 
                                    textAnchor="middle" 
                                    fill={isDragging ? '#000' : '#fff'} 
                                    fontSize="10" 
                                    fontWeight="bold"
                                    pointerEvents="none"
                                >
                                    {node.label}
                                </text>
                                
                                {/* Category Label */}
                                <text 
                                    y="65" 
                                    textAnchor="middle" 
                                    fill={isDragging ? '#666' : '#94a3b8'} 
                                    fontSize="7" 
                                    pointerEvents="none"
                                    style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                                >
                                    {node.category}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            )}
        </div>
        
        {/* Legend */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-cyan-600" /> Market</div>
            <div className="flex items-center gap-2"><Box className="w-3 h-3 text-violet-600" /> Product</div>
            <div className="flex items-center gap-2"><Settings className="w-3 h-3 text-slate-600" /> Operation</div>
            <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 text-emerald-600" /> Finance</div>
            <div className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-red-600" /> Risk</div>
        </div>
      </div>
    </div>
  );
};

export default StrategyMap;
