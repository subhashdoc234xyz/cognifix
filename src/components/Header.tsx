import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  Sparkles, 
  LayoutDashboard, 
  PenTool, 
  Layers, 
  Network, 
  Map, 
  GraduationCap, 
  Flame, 
  UserCircle2, 
  Home
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  user: UserProfile;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, user, onOpenAuth }) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'practice-and-quiz', label: 'Practice & Quiz', icon: <PenTool className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-4 h-4" /> },
    { id: 'mind-map', label: 'Mind Map', icon: <Network className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'teacher-portal', label: 'Teacher Portal', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#bfc7d2]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006096] to-[#007abc] flex items-center justify-center text-white shadow-sm shadow-[#006096]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-headline-sm text-[#0b1c30] tracking-tight flex items-center gap-1.5 font-bold">
              Cogni<span className="text-[#006096]">Fix</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-wider text-[#3f4851] font-semibold">
              Misconception Engine
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#e5eeff]/70 p-1 rounded-xl border border-[#bfc7d2]/30">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-[#006096] shadow-sm font-bold'
                    : 'text-[#3f4851] hover:text-[#0b1c30] hover:bg-white/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Diagnostic AI Status indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 tracking-wide">Multi-Agent AI: Active</span>
          </div>

          {/* Quick Streak Badge */}
          <div 
            title={`${user.streak} Day Learning Streak`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{user.streak}d</span>
          </div>

          {/* Start Practice Primary CTA */}
          {currentView !== 'practice-and-quiz' && (
            <button
              id="header-start-practice-btn"
              onClick={() => onNavigate('practice-and-quiz')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#006096] text-white hover:bg-[#007abc] transition-all shadow-sm hover:shadow active:scale-95"
            >
              Start Practice
            </button>
          )}

          {/* User Account Button */}
          <button
            id="header-user-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] border border-[#bfc7d2]/40 transition-colors text-xs font-semibold text-[#0b1c30]"
          >
            <div className="w-6 h-6 rounded-full bg-[#006096] text-white flex items-center justify-center text-[11px] font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-[#bfc7d2]/20 bg-[#eff4ff]/60 no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={`m-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-all ${
                isActive
                  ? 'bg-[#006096] text-white shadow-xs'
                  : 'text-[#3f4851] hover:text-[#0b1c30] bg-white/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
