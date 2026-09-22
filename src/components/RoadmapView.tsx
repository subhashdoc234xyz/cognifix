import React, { useState } from 'react';
import { RoadmapStep, ViewMode } from '../types';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Video, 
  FileText, 
  RefreshCw, 
  ArrowRight,
  Plus
} from 'lucide-react';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  onNavigate: (view: ViewMode) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ steps: initialSteps, onNavigate }) => {
  const [steps, setSteps] = useState<RoadmapStep[]>(initialSteps);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  if (steps.length === 0) {
    return <div className="min-h-screen bg-[#f8f9ff] px-4 py-16 sm:px-6"><div className="mx-auto max-w-xl rounded-2xl border border-[#bfc7d2]/40 bg-white p-8 text-center shadow-xs"><Map className="mx-auto h-9 w-9 text-[#006096]" /><h1 className="mt-4 text-xl font-bold text-[#0b1c30]">Your learning roadmap starts here</h1><p className="mt-2 text-sm leading-6 text-[#3f4851]">Complete a first practice session, then use your diagnostics to create a focused plan.</p><button onClick={() => onNavigate('practice-and-quiz')} className="mt-6 rounded-xl bg-[#006096] px-5 py-3 text-xs font-bold text-white">Start practice</button></div></div>;
  }

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/agents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.warn('Search agent error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch('/api/agents/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTraps: ['Arithmetic Invariance on Infinity', 'Geometric Degeneracy Bias'],
          subject: 'Undergraduate STEM & Advanced Analysis'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.steps && data.steps.length > 0) {
          setSteps(data.steps.map((st: any, i: number) => ({
            id: 'gen_step_' + i,
            stepNumber: i + 1,
            title: st.title,
            topic: st.topic || 'Advanced STEM',
            description: st.description,
            completed: st.completed || false,
            timeEstimate: st.timeEstimate || '1 hour',
            resources: st.resources || []
          })));
        }
      }
    } catch (e) {
      console.warn('Roadmap regeneration error:', e);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bfc7d2]/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Map className="w-5 h-5" />
            </span>
            <h1 className="font-headline-sm text-xl font-bold text-[#0b1c30]">
              Grounded Adaptive Roadmap
            </h1>
          </div>
          <p className="text-xs text-[#3f4851] mt-1">
            Ordered milestones constructed by the Roadmap Agent with verified open-course materials
          </p>
        </div>

        <button
          onClick={handleRegenerateRoadmap}
          disabled={isGeneratingRoadmap}
          className="px-4 py-2 rounded-xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
        >
          {isGeneratingRoadmap ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Optimizing Sequence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-Synthesize Roadmap</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#bfc7d2]/40 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#0b1c30]">
          <span>Curriculum Mastery Progress</span>
          <span className="text-[#006096]">{completedCount} of {steps.length} Milestones Completed</span>
        </div>
        <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#006096] h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Sequence Timeline */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-6 rounded-2xl border transition-all ${
              step.completed
                ? 'bg-white/80 border-[#bfc7d2]/40 shadow-xs'
                : 'bg-white border-2 border-[#006096]/30 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 mt-0.5 ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-[#006096] text-[#006096] hover:bg-[#eff4ff]'
                  }`}
                  title={step.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {step.completed ? '✓' : step.stepNumber}
                </button>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006096] bg-[#eff4ff] px-2 py-0.5 rounded">
                      {step.topic}
                    </span>
                    <span className="text-[11px] text-[#707882] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {step.timeEstimate}
                    </span>
                  </div>
                  <h3 className={`font-headline-sm text-base font-bold ${
                    step.completed ? 'line-through text-[#707882]' : 'text-[#0b1c30]'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#3f4851] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('practice-and-quiz')}
                className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006096] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Practice Node</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Grounded Resource links */}
            {step.resources && step.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#bfc7d2]/30 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-bold text-[#3f4851]">Grounded Resources:</span>
                {step.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f8f9ff] border border-[#bfc7d2]/40 hover:border-[#006096] text-[#0b1c30] text-xs transition-colors font-medium"
                  >
                    {res.type === 'video' ? (
                      <Video className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#006096]" />
                    )}
                    <span className="truncate max-w-[200px]">{res.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#707882]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search Agent Live Resource Grounding Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#006096]" />
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
              Search Agent Resource Grounding (DuckDuckGo Academic Integration)
            </h3>
            <p className="text-[11px] text-[#3f4851]">
              Lookup open video explanations, MIT OCW notes, or Wolfram proofs for any topic
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic e.g. 'Spectral Theorem proof 3blue1brown' or 'Indeterminate forms'"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#bfc7d2]/70 focus:outline-none focus:ring-1 focus:ring-[#006096] text-[#0b1c30]"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-[#006096] text-white font-bold text-xs hover:bg-[#007abc] transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search Agent</span>
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-200">
            <span className="text-[11px] font-bold text-[#006096]">Retrieved Resources:</span>
            {searchResults.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#eff4ff] border border-[#bfc7d2]/40 text-xs flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-[#0b1c30]">{r.title}</h4>
                  <p className="text-[11px] text-[#3f4851] mt-0.5">{r.snippet}</p>
                  <span className="text-[10px] text-[#006096] font-semibold mt-1 inline-block">{r.source}</span>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-white border border-[#bfc7d2]/50 hover:bg-[#dce9ff] text-[11px] font-bold text-[#006096] shrink-0 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
