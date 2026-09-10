import React from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// 13 Screen Page Imports
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LearningSetupPage } from './pages/LearningSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { TopicSelectionPage } from './pages/TopicSelectionPage';
import { QuestionPage } from './pages/QuestionPage';
import { ResultPage } from './pages/ResultPage';
import { AIRecommendationPage } from './pages/AIRecommendationPage';
import { KnowledgeProfilePage } from './pages/KnowledgeProfilePage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { RevisionCenterPage } from './pages/RevisionCenterPage';
import { ProfilePage } from './pages/ProfilePage';

const ScreenRouter = () => {
  const { currentScreen } = useLearning();

  switch (currentScreen) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'setup':
      return <LearningSetupPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'topics':
      return <TopicSelectionPage />;
    case 'question':
      return <QuestionPage />;
    case 'result':
      return <ResultPage />;
    case 'ai-recommendation':
      return <AIRecommendationPage />;
    case 'knowledge-profile':
      return <KnowledgeProfilePage />;
    case 'progress-analytics':
      return <ProgressAnalyticsPage />;
    case 'revision':
      return <RevisionCenterPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <DashboardPage />;
  }
};

export default function App() {
  return (
    <LearningProvider>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ScreenRouter />
          </main>
        </div>
        <Footer />
      </div>
    </LearningProvider>
  );
}
