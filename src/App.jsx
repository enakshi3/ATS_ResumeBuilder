import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import ScanResults from './pages/ScanResults';
import ScanHistory from './pages/ScanHistory';
import ResumeBuilder from './pages/ResumeBuilder';
import JobTracker from './pages/JobTracker';
import FindJobs from './pages/FindJobs';
import LinkedInScan from './pages/LinkedInScan';
import CoverLetter from './pages/CoverLetter';
import InterviewPrep from './pages/InterviewPrep';
import EmailTemplates from './pages/EmailTemplates';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';

/* =========================
   Protected Route
========================= */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loader">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   Public Route
========================= */
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loader">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================
   App Routes
========================= */
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<NewScan />} />
        <Route path="scan/results" element={<ScanResults />} />
        <Route path="scan/results/:id" element={<ScanResults />} />
        <Route path="scan/history" element={<ScanHistory />} />
        <Route path="resume" element={<ResumeBuilder />} />
        <Route path="jobs" element={<JobTracker />} />
        <Route path="find-jobs" element={<FindJobs />} />
        <Route path="linkedin" element={<LinkedInScan />} />
        <Route path="cover-letter" element={<CoverLetter />} />
        <Route path="interview" element={<InterviewPrep />} />
        <Route path="emails" element={<EmailTemplates />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}
