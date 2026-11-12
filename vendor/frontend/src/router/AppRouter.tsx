import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LearningSetupPage } from '../pages/LearningSetupPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DSATopicsPage } from '../pages/DSATopicsPage';
import { PracticeQuestionsPage } from '../pages/PracticeQuestionsPage';
import { AnswerResultPage } from '../pages/AnswerResultPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="setup" element={<LearningSetupPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="topics" element={<DSATopicsPage />} />
          <Route path="practice" element={<PracticeQuestionsPage />} />
          <Route path="result" element={<AnswerResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
