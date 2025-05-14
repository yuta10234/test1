import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import PerformancePage from './components/pages/PerformancePage';
import GamePage from './components/pages/GamePage';
import CleanupPage from './components/pages/CleanupPage';
import SettingsFilePage from './components/pages/SettingsFilePage';
import PreferencesPage from './components/pages/PreferencesPage';
import NetworkPage from './components/pages/NetworkPage';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { SystemProvider } from './context/SystemContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SystemProvider>
        <SettingsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="game" element={<GamePage />} />
                <Route path="network" element={<NetworkPage />} />
                <Route path="cleanup" element={<CleanupPage />} />
                <Route path="settings-file" element={<SettingsFilePage />} />
                <Route path="settings" element={<PreferencesPage />} />
              </Route>
              <Route path="*" element={<App />} />
            </Routes>
          </Router>
        </SettingsProvider>
      </SystemProvider>
    </AuthProvider>
  </StrictMode>
);