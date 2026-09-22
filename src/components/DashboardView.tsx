import React, { useState } from 'react';
import { ViewMode, UserProfile, DiagnosticLog } from '../types';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  Network, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  logs: DiagnosticLog[];
  onNavigate: (view: ViewMode) => void;
  onSelectPracticeTopic?: (topic: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  logs,
  onNavigate,
  onSelectPracticeTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Remediated' | 'Active Queue'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.flaggedTrap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.traceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const header = "Trace ID,Subject,Cognitive Trap,Status,Resolved In,Date\n";
    const rows = filteredLogs.map(l => `"${l.traceId}","${l.subject}","${l.flaggedTrap}","${l.status}","${l.resolvedIn}","${l.date}"`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CogniFix_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Diagnostic audit CSV exported successfully.");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Core Diagnostics Telemetry Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#bfc7d2]/40 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#006096] to-[#007abc] flex items-center justify-center text-white shadow-sm">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-lg font-bold text-[#0b1c30]">
                Cognitive Diagnostic Core v4.2
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-[#3f4851] mt-0.5">
              Targeting latent cognitive distortions & formal symbolic verification
            </p>
          </div>
        </div>

        {/* User stats right banner */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-[#eff4ff] border border-[#bfc7d2]/40 text-[#006096] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{user.streak}-Day Streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#eff4ff] border border-[#bfc7d2]/40 text-[#006096] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>+{user.xp} XP</span>
          </div>
          <div className="hidden sm:block px-3 py-1.5 rounded-xl bg-[#006096] text-white">
            <span>{user.tier}</span>
          </div>
        </div>
      </div>

      {/* 3-Column Core Metrics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Conceptual Mastery Score */}
        <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3f4851]">
                Mastery P-Score
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-[#0b1c30]">{user.masteryScore}%</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +6.4% this wk
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#006096] border-t-transparent flex items-center justify-center font-bold text-xs text-[#006096]">
              {user.masteryScore}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#bfc7d2]/30 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#3f4851] block text-[11px]">Bugs Remediated</span>
              <span className="font-bold text-[#0b1c30]">14 Resolved</span>
            </div>
            <div>
              <span className="text-[#3f4851] block text-[11px]">Active Traps</span>
              <span className="font-bold text-amber-600">4 Under Observation</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Vulnerability Trap Risk */}
        <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3f4851]">
                Latent Trap Index
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Low Risk
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-[#0b1c30]">12.4%</span>
              <span className="text-xs text-[#3f4851]">distortion probability</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12.4%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#3f4851]">
              <span>Optimal &lt; 15%</span>
              <span>2 Critical Traps Neutralized</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#bfc7d2]/30 flex items-center justify-between text-xs">
            <span className="text-[#3f4851]">Distractor Resilience</span>
            <span className="font-bold text-[#006096]">98.2% Proof Grounding</span>
          </div>
        </div>

        {/* Metric 3: Retention Half-Life Stability */}
        <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3f4851]">
                Memory Half-Life
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#006096] text-[10px] font-bold">
                Optimal Decay Band
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-[#0b1c30]">18.4d</span>
              <span className="text-xs text-emerald-600 font-semibold">94.2% stability</span>
            </div>
          </div>

          {/* Sparkline visualization */}
          <div className="mt-3 flex items-end gap-1 h-8">
            {[40, 55, 60, 75, 70, 85, 94].map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-[#cee5ff] hover:bg-[#006096] rounded-t transition-colors"
                style={{ height: `${val}%` }}
                title={`Interval ${i + 1}: ${val}% retention`}
              />
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-[#bfc7d2]/30 flex items-center justify-between text-xs">
            <span className="text-[#3f4851]">Next Spaced Micro-Session</span>
            <span className="font-bold text-[#006096]">Today (3 Due)</span>
          </div>
        </div>
      </div>

      {/* Primary Active Misconception Alert Card */}
      <div className="bg-gradient-to-r from-[#eff4ff] via-white to-[#eff4ff] p-6 rounded-2xl border-2 border-[#006096]/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#006096] text-white text-xs font-bold uppercase tracking-wider">
                Priority Diagnostic Alert
              </span>
              <span className="text-xs font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                Err: #4092
              </span>
            </div>

            <h2 className="font-headline-sm text-xl font-bold text-[#0b1c30]">
              Multivariable Calculus: Gradient vs Directional Projection
            </h2>

            <p className="text-xs text-[#3f4851] max-w-3xl leading-relaxed">
              <strong>Diagnosed Cognitive Bug:</strong> In 3 of 4 recent tasks, you calculated directional derivatives by projecting the gradient vector along un-normalized coordinates rather than the unit direction vector <code className="bg-white px-1.5 py-0.5 rounded text-[#006096] font-mono">u = v / ||v||</code>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              id="dash-launch-socratic-btn"
              onClick={() => onNavigate('practice-and-quiz')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Launch Socratic Remediation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="dash-inspect-tree-btn"
              onClick={() => onNavigate('mind-map')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#bfc7d2]/60 text-[#0b1c30] font-semibold text-xs hover:bg-[#f8f9ff] transition-all flex items-center justify-center gap-2"
            >
              <Network className="w-4 h-4 text-[#006096]" />
              <span>Inspect Tree</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Middle Section: Practice Hub & Memory Decay Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Intelligent Practice Hub (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                Intelligent Practice Hub
              </h3>
              <p className="text-xs text-[#3f4851]">Targeted calibration and misconception mitigation</p>
            </div>
            <button
              onClick={() => onNavigate('practice-and-quiz')}
              className="text-xs font-bold text-[#006096] hover:underline flex items-center gap-1"
            >
              <span>All Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Quick Tile 1 */}
            <div
              onClick={() => onNavigate('practice-and-quiz')}
              className="p-4 rounded-xl border border-[#bfc7d2]/40 bg-[#eff4ff]/60 hover:bg-[#e5eeff] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#006096] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#0b1c30]">Diagnostic Sandbox</h4>
              <p className="text-[11px] text-[#3f4851]">Linear Algebra • Eigenvalues & Jordan Blocks</p>
            </div>

            {/* Quick Tile 2 */}
            <div
              onClick={() => {
                if (onSelectPracticeTopic) onSelectPracticeTopic('Calculus II');
                onNavigate('practice-and-quiz');
              }}
              className="p-4 rounded-xl border border-[#bfc7d2]/40 bg-[#eff4ff]/60 hover:bg-[#e5eeff] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#0b1c30]">5-Min Calibration</h4>
              <p className="text-[11px] text-[#3f4851]">Indeterminate Forms & Infinity Traps</p>
            </div>

            {/* Quick Tile 3 */}
            <div
              onClick={() => onNavigate('flashcards')}
              className="p-4 rounded-xl border border-[#bfc7d2]/40 bg-[#eff4ff]/60 hover:bg-[#e5eeff] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#0b1c30]">Spaced Flashcards</h4>
              <p className="text-[11px] text-[#3f4851]">3 Counter-Intuitive Proofs Due</p>
            </div>
          </div>
        </div>

        {/* Right: Memory Decay Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
              Memory Decay Watchlist
            </h3>
            <span className="text-[11px] font-semibold text-[#006096] bg-[#eff4ff] px-2 py-0.5 rounded">
              Spaced Ebbinghaus
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-red-950 block">Linear Algebra: Spectral Theorem</span>
                <span className="text-[11px] text-red-700">18 hours until recall decay</span>
              </div>
              <button 
                onClick={() => onNavigate('practice-and-quiz')}
                className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
              >
                Review
              </button>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-950 block">Thermodynamics: Isothermal Entropy</span>
                <span className="text-[11px] text-amber-800">3 days until threshold</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Stable
              </span>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">Quantum Mechanics: Probability Flux</span>
                <span className="text-[11px] text-emerald-800">6 days until decay</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Log & Resolution Audit Table */}
      <div className="bg-white rounded-2xl border border-[#bfc7d2]/40 shadow-xs overflow-hidden">
        {/* Table header bar */}
        <div className="p-5 border-b border-[#bfc7d2]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
              Diagnostic Log & Resolution Audit
            </h3>
            <p className="text-xs text-[#3f4851]">
              Historical trace of detected misconceptions and remediation verified times
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#707882]" />
              <input
                type="text"
                placeholder="Search trace or trap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#bfc7d2]/60 focus:outline-none focus:ring-1 focus:ring-[#006096] text-[#0b1c30]"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  statusFilter === 'all' ? 'bg-[#006096] text-white' : 'bg-[#eff4ff] text-[#3f4851]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Remediated')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  statusFilter === 'Remediated' ? 'bg-[#006096] text-white' : 'bg-[#eff4ff] text-[#3f4851]'
                }`}
              >
                Remediated
              </button>
              <button
                onClick={() => setStatusFilter('Active Queue')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  statusFilter === 'Active Queue' ? 'bg-[#006096] text-white' : 'bg-[#eff4ff] text-[#3f4851]'
                }`}
              >
                Active
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg border border-[#bfc7d2]/60 hover:bg-[#eff4ff] text-xs font-semibold text-[#006096] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#eff4ff]/60 border-b border-[#bfc7d2]/30 text-[#3f4851] font-semibold">
              <tr>
                <th className="py-3 px-5">Trace ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Flagged Cognitive Trap</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Resolved In</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc7d2]/20 text-[#0b1c30]">
              {filteredLogs.map((log) => (
                <tr key={log.traceId} className="hover:bg-[#f8f9ff]/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-semibold text-[#006096]">
                    {log.traceId}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{log.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30]">{log.flaggedTrap}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Remediated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {log.status === 'Remediated' ? '✓ Remediated' : '⏳ Active Queue'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#3f4851]">{log.resolvedIn}</td>
                  <td className="py-3.5 px-4 text-[#3f4851]">{log.date}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onNavigate('practice-and-quiz')}
                      className="text-[#006096] hover:underline font-bold text-xs"
                    >
                      Re-Test
                    </button>
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
