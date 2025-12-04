import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';
import LoadingPage from './pages/LoadingPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </Router>
  );
}

export default App;
