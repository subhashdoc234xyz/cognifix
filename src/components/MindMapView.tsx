import React, { useState } from 'react';
import { MindMapNode, ViewMode } from '../types';
import { Network, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface MindMapViewProps {
  nodes: MindMapNode[];
  onNavigate: (view: ViewMode) => void;
  onSelectNodeForPractice?: (node: MindMapNode) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({
  nodes,
  onNavigate,
  onSelectNodeForPractice
}) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(nodes[3] || nodes[0]);

  if (!selectedNode) {
    return <div className="min-h-screen bg-[#f8f9ff] px-4 py-16 sm:px-6"><div className="mx-auto max-w-xl rounded-2xl border border-[#bfc7d2]/40 bg-white p-8 text-center shadow-xs"><Network className="mx-auto h-9 w-9 text-purple-700" /><h1 className="mt-4 text-xl font-bold text-[#0b1c30]">Your knowledge map will grow here</h1><p className="mt-2 text-sm leading-6 text-[#3f4851]">Practice a topic to begin mapping the concepts you are learning.</p><button onClick={() => onNavigate('practice-and-quiz')} className="mt-6 rounded-xl bg-[#006096] px-5 py-3 text-xs font-bold text-white">Start practice</button></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bfc7d2]/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Network className="w-5 h-5" />
            </span>
            <h1 className="font-headline-sm text-xl font-bold text-[#0b1c30]">
              Neural Knowledge Graph & Misconception Cascades
            </h1>
          </div>
          <p className="text-xs text-[#3f4851] mt-1">
            Visualizing how early mental model distortions propagate into advanced STEM theorems
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#bfc7d2]/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#3f4851]">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-700 font-semibold">Active Trap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006096]" />
            <span className="text-[#3f4851]">Unlocked</span>
          </div>
        </div>
      </div>

      {/* Main Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#bfc7d2]/40 shadow-xs p-6 relative overflow-hidden min-h-[500px]">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#006096_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* limits -> continuity */}
            <line x1="140" y1="200" x2="280" y2="120" stroke="#bfc7d2" strokeWidth="2" strokeDasharray="4" />
            {/* limits -> trap infinity */}
            <line x1="140" y1="200" x2="290" y2="300" stroke="#f87171" strokeWidth="2.5" />
            {/* continuity -> derivatives */}
            <line x1="280" y1="120" x2="420" y2="150" stroke="#bfc7d2" strokeWidth="2" />
            {/* derivatives -> gradients */}
            <line x1="420" y1="150" x2="580" y2="220" stroke="#f87171" strokeWidth="2.5" />
            {/* gradients -> spectral */}
            <line x1="580" y1="220" x2="740" y2="300" stroke="#006096" strokeWidth="2" />
          </svg>

          {/* Interactive Nodes */}
          <div className="relative w-full h-full min-h-[460px]">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isTrap = node.status === 'vulnerable';
              const isMastered = node.status === 'mastered';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    left: `${Math.min(node.x, 620)}px`,
                    top: `${node.y}px`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl cursor-pointer transition-all max-w-[200px] select-none ${
                    isSelected 
                      ? 'ring-4 ring-[#006096]/30 shadow-lg scale-105 z-20' 
                      : 'hover:scale-102 z-10'
                  } ${
                    isTrap
                      ? 'bg-red-50 border-2 border-red-400 text-red-950 shadow-sm'
                      : isMastered
                      ? 'bg-white border-2 border-emerald-500 text-[#0b1c30] shadow-xs'
                      : 'bg-white border-2 border-[#006096] text-[#0b1c30] shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isTrap ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    ) : isMastered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#006096] shrink-0" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f4851]">
                      {node.subject}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug">{node.label}</h4>
                  {node.misconceptionRisk && (
                    <span className="mt-1 block text-[10px] font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                      Cascade Warning
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#bfc7d2]/40 shadow-xs space-y-5">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#bfc7d2]/30 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006096]">
                  {selectedNode.subject} • Level {selectedNode.level}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedNode.status === 'vulnerable'
                      ? 'bg-red-100 text-red-900'
                      : selectedNode.status === 'mastered'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-blue-100 text-[#006096]'
                  }`}
                >
                  {selectedNode.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-headline-sm text-lg font-bold text-[#0b1c30]">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-[#3f4851] mt-1.5 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.misconceptionRisk && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-900">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Active Cascade Vulnerability</span>
                  </div>
                  <p className="leading-relaxed">{selectedNode.misconceptionRisk}</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[#bfc7d2]/30 text-xs">
                <span className="font-bold text-[#0b1c30] block">Dependency Linkages:</span>
                <p className="text-[#3f4851] text-[11px]">
                  Flaws in this node propagate into multivariable surface integrals, directional gradients, and spectral theorem decompositions.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (onSelectNodeForPractice) onSelectNodeForPractice(selectedNode);
                  onNavigate('practice-and-quiz');
                }}
                className="w-full py-2.5 rounded-xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                <span>Launch Diagnostic Calibration for Node</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-[#707882] text-xs">
              Select a node in the neural knowledge tree to inspect prerequisite dependencies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
