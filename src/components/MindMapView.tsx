import React, { useState, useEffect } from 'react';
import { MindMapNode, ViewMode } from '../types';
import { 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Lightbulb, 
  Code2, 
  Compass, 
  BookOpen,
  Filter,
  Check,
  RefreshCw,
  Layers
} from 'lucide-react';

interface MindMapViewProps {
  nodes: MindMapNode[];
  onNavigate: (view: ViewMode) => void;
  onSelectNodeForPractice?: (node: MindMapNode) => void;
  onUpdateNodeStatus?: (nodeId: string, status: MindMapNode['status']) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({
  nodes,
  onNavigate,
  onSelectNodeForPractice,
  onUpdateNodeStatus,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'traps' | 'mastered' | 'unlocked'>('all');

  // Keep selected node in sync when nodes update
  useEffect(() => {
    if (nodes.length > 0) {
      if (!selectedNodeId || !nodes.find(n => n.id === selectedNodeId)) {
        // Prioritize vulnerable trap node, otherwise first node
        const trapNode = nodes.find(n => n.status === 'vulnerable');
        setSelectedNodeId(trapNode ? trapNode.id : nodes[0].id);
      }
    }
  }, [nodes, selectedNodeId]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#bfc7d2]/40 bg-white p-8 text-center shadow-xs">
          <Network className="mx-auto h-10 w-10 text-purple-700 animate-pulse" />
          <h1 className="mt-4 text-xl font-bold text-[#0b1c30]">Your Knowledge Map is Assembling</h1>
          <p className="mt-2 text-sm leading-6 text-[#3f4851]">
            Upload your homework or start a practice question to generate your dynamic concept tree.
          </p>
          <button
            onClick={() => onNavigate('practice-and-quiz')}
            className="mt-6 rounded-xl bg-[#006096] px-5 py-3 text-xs font-bold text-white hover:bg-[#007abc] transition-all shadow-sm"
          >
            Start Practice & Calibration
          </button>
        </div>
      </div>
    );
  }

  // Calculate layout coordinates dynamically if nodes are bunched or default
  const levelBuckets: Record<number, MindMapNode[]> = { 1: [], 2: [], 3: [] };
  nodes.forEach(node => {
    const lvl = node.level === 3 ? 3 : node.level === 2 ? 2 : 1;
    levelBuckets[lvl].push(node);
  });

  const getCleanPosition = (node: MindMapNode) => {
    const lvl = node.level === 3 ? 3 : node.level === 2 ? 2 : 1;
    const bucket = levelBuckets[lvl];
    const idx = bucket.findIndex(n => n.id === node.id);
    const count = bucket.length || 1;
    
    // Default x by level
    const xBase = lvl === 1 ? 130 : lvl === 2 ? 370 : 610;
    // Distribute y nicely in a 520px canvas
    const yBase = Math.round(90 + (340 / (count + 1)) * (idx + 1));

    // If node already has valid, non-overlapping coordinates and isn't the single old fallback, use it
    if (node.x && node.y && count > 1 && node.x > 50 && node.x < 700) {
      return { x: node.x, y: node.y };
    }
    return { x: xBase, y: yBase };
  };

  // Node position map
  const positionMap = new Map<string, { x: number; y: number }>();
  nodes.forEach(n => {
    positionMap.set(n.id, getCleanPosition(n));
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Filter nodes for canvas view
  const visibleNodes = nodes.filter(n => {
    if (filter === 'traps') return n.status === 'vulnerable';
    if (filter === 'mastered') return n.status === 'mastered';
    if (filter === 'unlocked') return n.status === 'unlocked';
    return true;
  });

  // Calculate prerequisite connection pairs
  const connections: Array<{
    sourceId: string;
    targetId: string;
    sourcePos: { x: number; y: number };
    targetPos: { x: number; y: number };
    isTrapPath: boolean;
    isSelectedPath: boolean;
  }> = [];

  nodes.forEach(target => {
    const targetPos = positionMap.get(target.id);
    if (!targetPos) return;

    if (Array.isArray(target.prerequisites) && target.prerequisites.length > 0) {
      target.prerequisites.forEach(prereqId => {
        const source = nodes.find(n => n.id === prereqId);
        const sourcePos = positionMap.get(prereqId);
        if (source && sourcePos) {
          connections.push({
            sourceId: source.id,
            targetId: target.id,
            sourcePos,
            targetPos,
            isTrapPath: target.status === 'vulnerable' || source.status === 'vulnerable',
            isSelectedPath: selectedNode?.id === target.id || selectedNode?.id === source.id,
          });
        }
      });
    } else if (target.level > 1) {
      // Connect to the first node of the previous level as automatic topological fallthrough
      const prevLevelNodes = nodes.filter(n => n.level === target.level - 1);
      if (prevLevelNodes.length > 0) {
        const source = prevLevelNodes[0];
        const sourcePos = positionMap.get(source.id);
        if (sourcePos) {
          connections.push({
            sourceId: source.id,
            targetId: target.id,
            sourcePos,
            targetPos,
            isTrapPath: target.status === 'vulnerable' || source.status === 'vulnerable',
            isSelectedPath: selectedNode?.id === target.id || selectedNode?.id === source.id,
          });
        }
      }
    }
  });

  // Find prerequisites and dependents for the selected node
  const selectedPrereqs = nodes.filter(n => selectedNode?.prerequisites?.includes(n.id));
  const selectedDependents = nodes.filter(n => n.prerequisites?.includes(selectedNode?.id || ''));

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bfc7d2]/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-xs">
              <Network className="w-5 h-5" />
            </span>
            <h1 className="font-headline-sm text-xl font-bold text-[#0b1c30]">
              Neural Knowledge Graph & Misconception Cascades
            </h1>
          </div>
          <p className="text-xs text-[#3f4851] mt-1">
            Visualizing foundational concepts, active cognitive traps, and higher-order theorem progressions.
          </p>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs bg-white px-3 py-2 rounded-2xl border border-[#bfc7d2]/50 shadow-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-xs'
                : 'text-[#3f4851] hover:text-[#0b1c30]'
            }`}
          >
            All Concepts ({nodes.length})
          </button>
          <button
            onClick={() => setFilter('traps')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'traps'
                ? 'bg-red-50 text-red-700 border border-red-200 shadow-xs'
                : 'text-[#3f4851] hover:text-red-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Traps ({nodes.filter(n => n.status === 'vulnerable').length})</span>
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'mastered'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                : 'text-[#3f4851] hover:text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mastered ({nodes.filter(n => n.status === 'mastered').length})</span>
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'unlocked'
                ? 'bg-blue-50 text-[#006096] border border-blue-200 shadow-xs'
                : 'text-[#3f4851] hover:text-[#006096]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#006096]" />
            <span>Unlocked</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Canvas + Pedagogical Concept Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#bfc7d2]/40 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between min-h-[560px]">
          {/* Subtle Grid Canvas Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#006096_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Level Column Watermark Banners */}
          <div className="grid grid-cols-3 gap-2 border-b border-[#bfc7d2]/20 pb-3 mb-2 text-center text-[10px] font-bold tracking-wider uppercase text-[#707882]">
            <div className="bg-[#f8f9ff] py-1 rounded-lg border border-[#bfc7d2]/20">
              Tier 1 • Foundations
            </div>
            <div className="bg-[#f8f9ff] py-1 rounded-lg border border-[#bfc7d2]/20">
              Tier 2 • Core & Pitfalls
            </div>
            <div className="bg-[#f8f9ff] py-1 rounded-lg border border-[#bfc7d2]/20">
              Tier 3 • Extensions
            </div>
          </div>

          {/* SVG Connection Lines */}
          <div className="relative w-full h-[470px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '100%', minHeight: '100%' }}>
              <defs>
                <linearGradient id="gradient-trap" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="gradient-mastered" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="gradient-unlocked" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#006096" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                </linearGradient>
                <marker
                  id="arrow-mastered"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker
                  id="arrow-trap"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444" />
                </marker>
                <marker
                  id="arrow-unlocked"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#006096" />
                </marker>
              </defs>

              {connections.map((conn, index) => {
                const { sourcePos, targetPos, isTrapPath, isSelectedPath } = conn;
                // Calculate cubic bezier control points for smooth horizontal flow
                const deltaX = Math.abs(targetPos.x - sourcePos.x) / 2;
                const pathData = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x + deltaX} ${sourcePos.y}, ${targetPos.x - deltaX} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;

                return (
                  <g key={`conn-${index}`}>
                    {/* Background glow if selected */}
                    {isSelectedPath && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isTrapPath ? '#fca5a5' : '#7dd3fc'}
                        strokeWidth="7"
                        strokeOpacity="0.4"
                      />
                    )}
                    {/* Main connection curve */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        isTrapPath
                          ? 'url(#gradient-trap)'
                          : isSelectedPath
                          ? '#006096'
                          : '#94a3b8'
                      }
                      strokeWidth={isSelectedPath ? '3' : '2'}
                      strokeDasharray={isTrapPath ? '5 4' : undefined}
                      markerEnd={
                        isTrapPath
                          ? 'url(#arrow-trap)'
                          : '#arrow-unlocked'
                      }
                      className={isTrapPath ? 'animate-pulse' : ''}
                    />
                    {/* Node anchor circle */}
                    <circle cx={sourcePos.x} cy={sourcePos.y} r="3.5" fill={isTrapPath ? '#ef4444' : '#006096'} />
                    <circle cx={targetPos.x} cy={targetPos.y} r="3.5" fill={isTrapPath ? '#ef4444' : '#006096'} />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Concept Node Cards */}
            {visibleNodes.map((node) => {
              const pos = positionMap.get(node.id) || { x: 300, y: 200 };
              const isSelected = selectedNode?.id === node.id;
              const isTrap = node.status === 'vulnerable';
              const isMastered = node.status === 'mastered';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    left: `${Math.min(pos.x, 620)}px`,
                    top: `${pos.y}px`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl cursor-pointer transition-all w-[180px] sm:w-[195px] select-none ${
                    isSelected 
                      ? 'ring-4 ring-[#006096]/35 shadow-xl scale-105 z-30' 
                      : 'hover:scale-102 hover:shadow-md z-10'
                  } ${
                    isTrap
                      ? 'bg-gradient-to-br from-red-50 to-rose-50/70 border-2 border-red-400 text-red-950 shadow-sm'
                      : isMastered
                      ? 'bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-500 text-[#0b1c30] shadow-xs'
                      : 'bg-white border-2 border-[#006096]/80 text-[#0b1c30] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isTrap ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 animate-bounce" />
                      ) : isMastered ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#006096] shrink-0" />
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#3f4851] truncate">
                        {node.subject}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isTrap ? 'bg-red-200 text-red-900' : isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-[#006096]'
                    }`}>
                      L{node.level}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs leading-snug line-clamp-2 text-[#0b1c30]">
                    {node.label}
                  </h4>

                  {node.misconceptionRisk && (
                    <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-red-700 bg-red-100/90 px-1.5 py-0.5 rounded">
                      <ShieldAlert className="w-3 h-3 text-red-600 shrink-0" />
                      <span className="truncate">Active Trap Point</span>
                    </div>
                  )}

                  {node.keyTakeaway && !node.misconceptionRisk && (
                    <p className="mt-1 text-[9px] text-[#707882] line-clamp-1 italic">
                      "{node.keyTakeaway}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Canvas Footer Hint */}
          <div className="flex items-center justify-between text-[11px] text-[#707882] pt-3 border-t border-[#bfc7d2]/20">
            <span>Click any concept to open its full pedagogical breakdown.</span>
            <span className="text-[10px] font-medium text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Conceptual Knowledge Graph Active
            </span>
          </div>
        </div>

        {/* Pedagogical Concept Teaching Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#bfc7d2]/40 shadow-xs space-y-5">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header Badges & Status Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bfc7d2]/30 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006096]">
                  {selectedNode.subject} • Level {selectedNode.level} Concept
                </span>
                
                {/* Status Toggle Pill */}
                <div className="flex items-center gap-1 bg-[#f8f9ff] p-1 rounded-xl border border-[#bfc7d2]/40">
                  <button
                    onClick={() => onUpdateNodeStatus && onUpdateNodeStatus(selectedNode.id, 'mastered')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedNode.status === 'mastered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#3f4851] hover:text-emerald-700'
                    }`}
                  >
                    Mastered
                  </button>
                  <button
                    onClick={() => onUpdateNodeStatus && onUpdateNodeStatus(selectedNode.id, 'vulnerable')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedNode.status === 'vulnerable'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-[#3f4851] hover:text-red-700'
                    }`}
                  >
                    Active Trap
                  </button>
                  <button
                    onClick={() => onUpdateNodeStatus && onUpdateNodeStatus(selectedNode.id, 'unlocked')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedNode.status === 'unlocked'
                        ? 'bg-[#006096] text-white shadow-xs'
                        : 'text-[#3f4851] hover:text-[#006096]'
                    }`}
                  >
                    Learning
                  </button>
                </div>
              </div>

              {/* Concept Title & Definition */}
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-[#0b1c30] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#006096] shrink-0" />
                  <span>{selectedNode.label}</span>
                </h3>
                <p className="text-xs text-[#3f4851] mt-2 leading-relaxed bg-[#f8f9ff] p-3 rounded-xl border border-[#bfc7d2]/30">
                  {selectedNode.description}
                </p>
              </div>

              {/* Core Mental Model / Key Takeaway (TEACHES THE CONCEPT) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>The Core Intuition / Golden Rule:</span>
                </div>
                <p className="leading-relaxed pl-5 font-medium">
                  {selectedNode.keyTakeaway || "Verify operations step-by-step from first principles rather than applying mechanical shortcuts."}
                </p>
              </div>

              {/* Worked Example / Math Formula / Code Block */}
              {selectedNode.exampleOrFormula && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
                    <Code2 className="w-4 h-4 text-[#006096]" />
                    <span>How it Works (Example / Formula):</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                    {selectedNode.exampleOrFormula}
                  </pre>
                </div>
              )}

              {/* Active Cognitive Trap & Misconception Warning */}
              {(selectedNode.status === 'vulnerable' || selectedNode.misconceptionRisk || selectedNode.commonMistake) && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-red-900">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Cognitive Trap to Avoid:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {selectedNode.misconceptionRisk || selectedNode.commonMistake}
                  </p>
                </div>
              )}

              {/* Why This Matters */}
              {selectedNode.whyItMatters && (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/70 text-xs text-purple-950 space-y-1">
                  <span className="font-bold block text-purple-900 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-purple-700" />
                    <span>Why This Unlocks Advanced STEM:</span>
                  </span>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    {selectedNode.whyItMatters}
                  </p>
                </div>
              )}

              {/* Dynamic Dependency Chain */}
              <div className="space-y-2 pt-2 border-t border-[#bfc7d2]/30 text-xs">
                <span className="font-bold text-[#0b1c30] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#006096]" />
                  <span>Concept Linkages in Knowledge Tree:</span>
                </span>

                <div className="space-y-1.5 text-[11px]">
                  {/* Prerequisites */}
                  <div>
                    <span className="text-[#707882] font-semibold mr-1">Requires:</span>
                    {selectedPrereqs.length > 0 ? (
                      <div className="inline-flex flex-wrap gap-1 mt-1">
                        {selectedPrereqs.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedNodeId(p.id)}
                            className="px-2 py-0.5 bg-[#f0f4f9] hover:bg-[#006096] hover:text-white rounded-md text-[#0b1c30] text-[10px] font-medium transition-all"
                          >
                            ← {p.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-700 font-medium italic">Foundational concept (No prerequisites)</span>
                    )}
                  </div>

                  {/* Unlocks */}
                  <div>
                    <span className="text-[#707882] font-semibold mr-1">Unlocks:</span>
                    {selectedDependents.length > 0 ? (
                      <div className="inline-flex flex-wrap gap-1 mt-1">
                        {selectedDependents.map(d => (
                          <button
                            key={d.id}
                            onClick={() => setSelectedNodeId(d.id)}
                            className="px-2 py-0.5 bg-[#f0f4f9] hover:bg-[#006096] hover:text-white rounded-md text-[#0b1c30] text-[10px] font-medium transition-all"
                          >
                            → {d.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#707882] italic">Capstone mastery node</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (onSelectNodeForPractice) onSelectNodeForPractice(selectedNode);
                  onNavigate('practice-and-quiz');
                }}
                className="w-full py-3 rounded-2xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>Practice & Calibrate This Concept</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-[#707882] text-xs">
              Select any node in the knowledge tree to inspect the concept explanation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
