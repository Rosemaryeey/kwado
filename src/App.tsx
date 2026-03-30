import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/AppContext';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import AITutor from '@/pages/AITutor';
import Diagnostic from '@/pages/Diagnostic';
import StudyPlan from '@/pages/StudyPlan';
import Practice from '@/pages/Practice';
import WeaknessMap from '@/pages/WeaknessMap';
import CBTSimulator from '@/pages/CBTSimulator';
import Progress from '@/pages/Progress';
import Recommendations from '@/pages/Recommendations';
import Settings from '@/pages/Settings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={
        <PrivateRoute>
          <Onboarding />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/ai-tutor" element={
        <PrivateRoute>
          <AITutor />
        </PrivateRoute>
      } />
      <Route path="/diagnostic" element={
        <PrivateRoute>
          <Diagnostic />
        </PrivateRoute>
      } />
      <Route path="/study-plan" element={
        <PrivateRoute>
          <StudyPlan />
        </PrivateRoute>
      } />
      <Route path="/practice" element={
        <PrivateRoute>
          <Practice />
        </PrivateRoute>
      } />
      <Route path="/weakness-map" element={
        <PrivateRoute>
          <WeaknessMap />
        </PrivateRoute>
      } />
      <Route path="/cbt-simulator" element={
        <PrivateRoute>
          <CBTSimulator />
        </PrivateRoute>
      } />
      <Route path="/progress" element={
        <PrivateRoute>
          <Progress />
        </PrivateRoute>
      } />
      <Route path="/recommendations" element={
        <PrivateRoute>
          <Recommendations />
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <div className="grain-overlay" />
      </Router>
    </AppProvider>
  );
};

export default App;
