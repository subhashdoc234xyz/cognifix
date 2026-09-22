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

const uploadDiagnosticStorageKey = (userId: string) => `cognifix_upload_diagnostic_${userId}`;

function loadSavedUploadDiagnostic(userId: string): QuizQuestion | null {
  if (!userId || userId === initialUserProfile.id) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(uploadDiagnosticStorageKey(userId)) || 'null') as QuizQuestion | null;
    return saved?.stem && Array.isArray(saved.options) && saved.options.length === 4 ? saved : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cognifix_user');
    if (!saved) return initialUserProfile;
    try {
      const parsed = JSON.parse(saved) as UserProfile;
      // Remove the legacy seeded profile from browsers that used the old demo build.
      return parsed.id === 'usr_cogni_4092' || parsed.email === 'learner@cognifix.edu' ? initialUserProfile : parsed;
    } catch {
      return initialUserProfile;
    }
  });

  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion>(sampleQuizQuestion);
  const [logs, setLogs] = useState<DiagnosticLog[]>(initialDiagnosticLogs);
  const [flashcards] = useState<typeof initialFlashcards>([]);
  const [mindMapNodes] = useState<typeof initialMindMapNodes>([]);
  const [roadmapSteps] = useState<typeof initialRoadmapSteps>([]);
  const [teacherStats] = useState<typeof initialTeacherStats>({
    totalStudents: 0, avgMastery: 0, activeTrapsFlagged: 0, remediationSuccessRate: 0,
    topMisconceptions: [], studentRoster: []
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(() => sessionStorage.getItem('cognifix_access_token'));
  const isAuthenticated = !user.isGuest;

  // Keep an uploaded-work diagnostic tied to the student after a new sign-in.
  useEffect(() => {
    const savedQuestion = isAuthenticated ? loadSavedUploadDiagnostic(user.id) : null;
    if (savedQuestion) setActiveQuestion(savedQuestion);
  }, [isAuthenticated, user.id]);

  useEffect(() => {
    const callbackToken = new URLSearchParams(window.location.hash.slice(1)).get('access_token');
    const token = callbackToken || sessionStorage.getItem('cognifix_access_token');
    if (!token) return;
    try {
      const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = encodedPayload.padEnd(encodedPayload.length + (4 - encodedPayload.length % 4) % 4, '=');
      const payload = JSON.parse(decodeURIComponent(escape(atob(paddedPayload))));
      const metadata = payload.user_metadata || {};
      setUser({
        id: payload.sub,
        name: metadata.full_name || metadata.name || payload.email?.split('@')[0] || 'Student',
        email: payload.email || '',
        isGuest: false,
        role: 'student',
        streak: 0,
        xp: 0,
        tier: 'Self-paced learner',
        masteryScore: 0
      });
      const savedQuestion = loadSavedUploadDiagnostic(payload.sub);
      if (savedQuestion) setActiveQuestion(savedQuestion);
      sessionStorage.setItem('cognifix_access_token', token);
      setAccessToken(token);
      window.history.replaceState(null, '', window.location.pathname);
      setCurrentView('dashboard');
    } catch {
      sessionStorage.removeItem('cognifix_access_token');
      setAccessToken(null);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cognifix_user', JSON.stringify(user));
  }, [user]);

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    setCurrentView('dashboard');
  };

  const handleSelectPracticeTopic = (topic: string) => {
    if (topic.toLowerCase().includes('calculus')) {
      setActiveQuestion(sampleCalculusQuestion);
    } else {
      setActiveQuestion(sampleQuizQuestion);
    }
    setCurrentView('practice-and-quiz');
  };

  const handleDiagnoseUpload = async (upload: { path: string; name: string }) => {
    if (!accessToken) throw new Error('Please sign in again before diagnosing your upload.');
    const response = await fetch('/api/uploads/wrong-answer/diagnose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ storagePath: upload.path })
    });
    const result = await response.json();
    if (!response.ok || !result.question) throw new Error(result.error || 'Could not generate questions from this upload.');
    const generatedQuestion = result.question as QuizQuestion;
    localStorage.setItem(uploadDiagnosticStorageKey(user.id), JSON.stringify(generatedQuestion));
    setActiveQuestion(generatedQuestion);
    setCurrentView('practice-and-quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleNavigate = (view: ViewMode) => {
    if (view !== 'landing' && !isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    if (view === 'practice-and-quiz') {
      const savedQuestion = loadSavedUploadDiagnostic(user.id);
      if (savedQuestion) setActiveQuestion(savedQuestion);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#f8f9ff] text-[#0b1c30]">
      {/* Sticky App Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView onOpenAuth={() => setIsAuthOpen(true)} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            logs={logs}
            onNavigate={handleNavigate}
            accessToken={accessToken}
            onDiagnoseUpload={handleDiagnoseUpload}
          />
        )}

        {currentView === 'practice-and-quiz' && (
          <PracticeQuizView
            question={activeQuestion}
            onNavigate={handleNavigate}
            onQuestionCompleted={handleQuestionCompleted}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardsView
            flashcards={flashcards}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'mind-map' && (
          <MindMapView
            nodes={mindMapNodes}
            onNavigate={handleNavigate}
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
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'teacher-portal' && (
          <TeacherPortalView
            stats={teacherStats}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

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
