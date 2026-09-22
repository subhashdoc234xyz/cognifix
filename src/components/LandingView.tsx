import React, { useState } from 'react';
import { ViewMode } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Network, 
  Zap, 
  BookOpen, 
  Search, 
  BrainCircuit, 
  ChevronRight,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const [selectedDemoOption, setSelectedDemoOption] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [demoAnalyzed, setDemoAnalyzed] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#bfc7d2]/30">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#e5eeff]/80 to-transparent pointer-events-none -z-10 blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e5eeff] border border-[#006096]/20 text-[#006096] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#006096]" />
                <span>Next-Gen STEM Cognitive Diagnostics</span>
              </div>

              <h1 className="font-display-xl text-[#0b1c30] text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Traditional quizzes tell you you’re wrong. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006096] via-[#007abc] to-[#006385]">
                  CogniFix pinpoints the exact flaw in your reasoning.
                </span>
              </h1>

              <p className="font-body-lg text-[#3f4851] text-base sm:text-lg max-w-2xl leading-relaxed">
                Our multi-agent pipeline isolates latent STEM misconceptions, formally verifies remediation problems with symbolic solvers, and builds personalized memory retention paths for enduring mastery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="landing-hero-start-btn"
                  onClick={() => onNavigate('practice-and-quiz')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#006096] text-white text-sm font-bold shadow-md shadow-[#006096]/25 hover:bg-[#007abc] hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>Launch Diagnostic Sandbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="landing-hero-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0b1c30] border border-[#bfc7d2]/60 text-sm font-semibold hover:bg-[#f8f9ff] hover:border-[#006096]/50 transition-all shadow-xs"
                >
                  <Cpu className="w-4 h-4 text-[#006096]" />
                  <span>Inspect Cognitive Telemetry</span>
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#3f4851] font-medium border-t border-[#bfc7d2]/30 w-full">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Algorithmic Symbolic Verifier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-[#006096]" />
                  <span>Sub-symbolic Misconception Taxonomy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Zero Hallucination Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Diagnostic Inspection */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white rounded-2xl border border-[#bfc7d2]/40 shadow-xl overflow-hidden">
                {/* Header bar */}
                <div className="bg-[#eff4ff] px-4 py-3 border-b border-[#bfc7d2]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="font-semibold text-[#0b1c30] ml-2 font-mono text-[11px]">
                      DIAGNOSTIC TRACE #CALC-4092
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                    MISCONCEPTION DETECTED
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#006096]">
                      Calculus II • Limits at Infinity
                    </span>
                    <h3 className="font-headline-sm text-[#0b1c30] text-sm mt-1">
                      Evaluate: <span className="font-mono bg-[#eff4ff] px-2 py-0.5 rounded text-[#006096]">lim_(x → ∞) (3x² + 2) / (5x² - 4x)</span>
                    </h3>
                  </div>

                  {/* Interactive Options */}
                  <div className="space-y-2">
                    {[
                      { id: 'A', text: '0', isCorrect: false },
                      { id: 'B', text: '1 (Divided ∞ by ∞ = 1)', isCorrect: false, trap: true },
                      { id: 'C', text: '3/5 (Ratio of highest powers)', isCorrect: true },
                      { id: 'D', text: 'Does not exist (DNE)', isCorrect: false }
                    ].map((opt) => {
                      const isSelected = selectedDemoOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setSelectedDemoOption(opt.id as any);
                            setDemoAnalyzed(true);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? opt.trap
                                ? 'bg-red-50/70 border-red-300 text-red-950 font-medium'
                                : opt.isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-blue-50 border-blue-300 text-[#0b1c30]'
                              : 'bg-white border-[#bfc7d2]/40 text-[#3f4851] hover:bg-[#f8f9ff]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isSelected ? 'bg-[#006096] text-white' : 'bg-[#e5eeff] text-[#006096]'
                            }`}>
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && opt.trap && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                              Common Trap Trigger
                            </span>
                          )}
                          {isSelected && opt.isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Axiomatic Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Multi-Agent Analysis Bubble */}
                  {selectedDemoOption === 'B' ? (
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#eff4ff] to-[#e5eeff] border border-[#bfc7d2]/50 space-y-2.5 text-xs animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-[#bfc7d2]/30 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-[#006096]">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Diagnoser Agent (98% Confidence)</span>
                        </div>
                        <span className="text-[10px] font-mono bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-bold">
                          Err #204
                        </span>
                      </div>
                      <p className="text-[#0b1c30] leading-relaxed">
                        <strong className="text-red-700 font-semibold">Identified Misconception:</strong> Arithmetic Invariance on Infinity. The student mistakenly treated the indeterminate form ∞/∞ as algebraic cancellation equal to 1.
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-[#3f4851] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verifier Agent Generated Target Remediation
                        </span>
                        <button
                          onClick={() => onNavigate('practice-and-quiz')}
                          className="font-bold text-[#006096] hover:underline flex items-center gap-0.5"
                        >
                          Remediate Now <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : selectedDemoOption === 'C' ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Flawless Canonical Derivation</span>
                      </div>
                      <p>Factoring out dominant degree x² leaves ratio 3/5 while secondary terms vanish to 0.</p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                      <p className="font-semibold text-amber-900">Alternative distractor selected.</p>
                      <p>Click option B to view how the Diagnoser Agent flags the arithmetic infinity trap.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem with Traditional Quiz Engines Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006096] bg-[#e5eeff] px-3 py-1 rounded-full border border-[#006096]/20">
            Pedagogical Paradigm Shift
          </span>
          <h2 className="font-display-xl text-3xl sm:text-4xl text-[#0b1c30] font-bold">
            Why Standard Multiple-Choice Quizzes Fail STEM Students
          </h2>
          <p className="font-body-md text-[#3f4851] text-base">
            Binary right/wrong scoring treats wrong answers as zeroes instead of rich diagnostic footprints. CogniFix transforms errors into permanent cognitive breakthroughs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Quiz Engine */}
          <div className="p-8 rounded-2xl bg-white border border-red-200/80 shadow-xs space-y-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-sm text-lg text-[#0b1c30] font-bold">Traditional Quiz Engines</h3>
              <p className="text-xs text-red-700 font-semibold mt-1">Superficial Memorization & False Positives</p>
            </div>
            <ul className="space-y-3.5 text-xs text-[#3f4851]">
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold mt-0.5">✕</span>
                <span><strong>Binary Evaluation:</strong> Only checks if letter matches key, completely blind to student reasoning.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold mt-0.5">✕</span>
                <span><strong>Lucky Guessing:</strong> High scores can mask deep fundamental conceptual vulnerabilities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold mt-0.5">✕</span>
                <span><strong>Passive Explanations:</strong> Displays static answer keys that students skim without cognitive dissonance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold mt-0.5">✕</span>
                <span><strong>No Memory Decay Tracking:</strong> Ignores human forgetting curves until exams arrive.</span>
              </li>
            </ul>
          </div>

          {/* CogniFix Multi-Agent Engine */}
          <div className="p-8 rounded-2xl bg-white border border-[#006096]/30 shadow-md space-y-6 relative overflow-hidden ring-1 ring-[#006096]/10">
            <div className="w-10 h-10 rounded-xl bg-[#006096] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-sm text-lg text-[#0b1c30] font-bold">CogniFix Multi-Agent Engine</h3>
              <p className="text-xs text-[#006096] font-semibold mt-1">Diagnostic Root-Cause Remediation</p>
            </div>
            <ul className="space-y-3.5 text-xs text-[#3f4851]">
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span><strong>Latent Misconception Detection:</strong> Diagnoser Agent maps distractor choices directly to known cognitive pitfalls.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span><strong>Symbolic Verifier Agent:</strong> Rigorously validates new generated problems with automated proofs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span><strong>Socratic Epiphany Hints:</strong> Guides the mind through intuitive counter-examples and cognitive anchors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5">✓</span>
                <span><strong>Neural Knowledge Graph:</strong> Tracks vulnerability propagation across downstream STEM prerequisites.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Multi-Agent Architecture (4-Agent Flow) */}
      <section className="py-20 bg-[#eff4ff]/60 border-y border-[#bfc7d2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006096]">
              Autonomous Diagnostic Pipeline
            </span>
            <h2 className="font-display-xl text-3xl sm:text-4xl text-[#0b1c30] font-bold">
              How the Multi-Agent System Operates
            </h2>
            <p className="font-body-md text-[#3f4851]">
              Four specialized agents coordinate synchronously to convert student errors into validated learning milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agent 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#006096] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-headline-sm text-base text-[#0b1c30] font-bold">Diagnoser Agent</h3>
              <p className="text-xs text-[#3f4851] leading-relaxed">
                Ingests student answer selection, reasoning, and latency to classify the exact mental model misconception using our codified STEM error ontology.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#006096] bg-[#eff4ff] p-2 rounded-lg">
                Output: &#123; misconception, confidence, topic, errorTag &#125;
              </div>
            </div>

            {/* Agent 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-headline-sm text-base text-[#0b1c30] font-bold">Generator Agent</h3>
              <p className="text-xs text-[#3f4851] leading-relaxed">
                Synthesizes a fresh isomorphic problem specifically designed to probe whether the diagnosed misconception has been dispelled or persists.
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo-700 bg-indigo-50 p-2 rounded-lg">
                Output: Isomorphic STEM Challenge with trap distractor
              </div>
            </div>

            {/* Agent 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-headline-sm text-base text-[#0b1c30] font-bold">Verifier Agent</h3>
              <p className="text-xs text-[#3f4851] leading-relaxed">
                Executes symbolic math checks and algorithmic proofs to guarantee single-solution validity and distractor integrity before exposing it to the learner.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                Output: Verification Certificate & Proof Check
              </div>
            </div>

            {/* Agent 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#bfc7d2]/40 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-headline-sm text-base text-[#0b1c30] font-bold">Explainer Agent</h3>
              <p className="text-xs text-[#3f4851] leading-relaxed">
                Formulates Socratic inquiry prompts, visual analogies, and historical counter-examples so students understand why their intuition broke down.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-900 bg-amber-50 p-2 rounded-lg">
                Output: Socratic Epiphany & Cognitive Anchor
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Integrated Learning Workspaces Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006096]">
            Comprehensive Learning Ecosystem
          </span>
          <h2 className="font-display-xl text-3xl sm:text-4xl text-[#0b1c30] font-bold">
            All Workspaces Engineered for Cognitive Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Diagnostic Sandbox */}
          <div 
            onClick={() => onNavigate('practice-and-quiz')}
            className="p-6 rounded-2xl bg-white border border-[#bfc7d2]/40 shadow-xs hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#006096] flex items-center justify-center mb-4 group-hover:bg-[#006096] group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] group-hover:text-[#006096] transition-colors flex items-center justify-between">
              <span>Interactive Diagnostic Sandbox</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#3f4851] mt-2 leading-relaxed">
              Solve rigorous problems in Linear Algebra, Calculus, and Mechanics with live confidence tracking and immediate distractor analysis.
            </p>
          </div>

          {/* Card 2: Neural Knowledge Graph */}
          <div 
            onClick={() => onNavigate('mind-map')}
            className="p-6 rounded-2xl bg-white border border-[#bfc7d2]/40 shadow-xs hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] group-hover:text-purple-700 transition-colors flex items-center justify-between">
              <span>Neural Knowledge Graph</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#3f4851] mt-2 leading-relaxed">
              Trace conceptual dependency webs to see how a single misunderstanding in limits cascades into multivariable gradients.
            </p>
          </div>

          {/* Card 3: Memory Half-Life Flashcards */}
          <div 
            onClick={() => onNavigate('flashcards')}
            className="p-6 rounded-2xl bg-white border border-[#bfc7d2]/40 shadow-xs hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] group-hover:text-amber-800 transition-colors flex items-center justify-between">
              <span>Spaced Retention Studio</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#3f4851] mt-2 leading-relaxed">
              Strengthen recall with 3D flashcards that highlight counter-intuitive proofs and trap warnings at critical decay thresholds.
            </p>
          </div>

          {/* Card 4: Grounded Roadmap */}
          <div 
            onClick={() => onNavigate('roadmap')}
            className="p-6 rounded-2xl bg-white border border-[#bfc7d2]/40 shadow-xs hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] group-hover:text-emerald-800 transition-colors flex items-center justify-between">
              <span>Adaptive Remediation Roadmap</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#3f4851] mt-2 leading-relaxed">
              AI-generated study milestones grounded with real YouTube (3Blue1Brown, MIT OCW) and OpenCourseWare references via DuckDuckGo.
            </p>
          </div>

          {/* Card 5: Educator Portal */}
          <div 
            onClick={() => onNavigate('teacher-portal')}
            className="p-6 rounded-2xl bg-white border border-[#bfc7d2]/40 shadow-xs hover:shadow-md cursor-pointer transition-all group md:col-span-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] group-hover:text-blue-800 transition-colors flex items-center justify-between">
              <span>Teacher & Department Analytics Portal</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#3f4851] mt-2 leading-relaxed">
              Observe class-wide misconception clusters, dispatch targeted adaptive quizzes to students lagging in specific concepts, and export academic progress audits.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-[#006096] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display-xl text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to permanently debug your STEM mental models?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Begin with a 5-question micro-calibration or explore the live multi-agent diagnostics sandbox right now.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('practice-and-quiz')}
              className="px-6 py-3.5 rounded-xl bg-white text-[#006096] font-bold text-sm hover:bg-[#f8f9ff] shadow-lg transition-transform active:scale-95"
            >
              Start Free Diagnostic Session
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-[#007abc] border border-white/30 text-white font-semibold text-sm hover:bg-[#006385] transition-all"
            >
              Open Student Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
