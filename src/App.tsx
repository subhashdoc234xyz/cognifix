/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile, DiagnosticLog, QuizQuestion } from './types';
import { 
  initialUserProfile, 
  sampleQuizQuestion, 
  sampleCalculusQuestion,
  initialDiagnosticLogs, 
  initialFlashcards, 
  initialMindMapNodes, 
  initialRoadmapSteps, 
  initialTeacherStats 
} from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { PracticeQuizView } from './components/PracticeQuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { MindMapView } from './components/MindMapView';
import { RoadmapView } from './components/RoadmapView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cognifix_user');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion>(sampleQuizQuestion);
  const [logs, setLogs] = useState<DiagnosticLog[]>(initialDiagnosticLogs);
  const [flashcards] = useState(initialFlashcards);
  const [mindMapNodes] = useState(initialMindMapNodes);
  const [roadmapSteps] = useState(initialRoadmapSteps);
  const [teacherStats] = useState(initialTeacherStats);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cognifix_user', JSON.stringify(user));
  }, [user]);

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleSelectPracticeTopic = (topic: string) => {
    if (topic.toLowerCase().includes('calculus')) {
      setActiveQuestion(sampleCalculusQuestion);
    } else {
      setActiveQuestion(sampleQuizQuestion);
    }
    setCurrentView('practice-and-quiz');
  };

  const handleQuestionCompleted = (isCorrect: boolean, errorTag?: string) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + (isCorrect ? 35 : 15),
      masteryScore: isCorrect ? Math.min(100, prev.masteryScore + 1) : Math.max(50, prev.masteryScore - 1)
    }));

    if (!isCorrect && errorTag) {
      const newLog: DiagnosticLog = {
        traceId: '#LOG-' + Math.floor(8200 + Math.random() * 800),
        subject: activeQuestion.subject,
        topic: activeQuestion.topic,
        flaggedTrap: activeQuestion.detectedMisconceptions[0]?.name || 'Cognitive Distortion',
        status: 'Active Queue',
        resolvedIn: 'Under Remediation',
        date: 'Just now',
        severity: 'critical'
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Sticky App Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            logs={logs}
            onNavigate={(view) => setCurrentView(view)}
            onSelectPracticeTopic={handleSelectPracticeTopic}
          />
        )}

        {currentView === 'practice-and-quiz' && (
          <PracticeQuizView
            question={activeQuestion}
            onNavigate={(view) => setCurrentView(view)}
            onQuestionCompleted={handleQuestionCompleted}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardsView
            flashcards={flashcards}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'mind-map' && (
          <MindMapView
            nodes={mindMapNodes}
            onNavigate={(view) => setCurrentView(view)}
            onSelectNodeForPractice={(node) => {
              if (node.subject.toLowerCase().includes('calculus')) {
                setActiveQuestion(sampleCalculusQuestion);
              } else {
                setActiveQuestion(sampleQuizQuestion);
              }
              setCurrentView('practice-and-quiz');
            }}
          />
        )}

        {currentView === 'roadmap' && (
          <RoadmapView
            steps={roadmapSteps}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'teacher-portal' && (
          <TeacherPortalView
            stats={teacherStats}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
