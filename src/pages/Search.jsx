import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [found, setFound] = useState(true);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) return;

    const text = query.toLowerCase().trim();

    // 🔹 DASHBOARD (FIX)
    if (text === 'dashboard' || text.startsWith('das') || text === 'home') {
      navigate('/', { replace: true });
      return;
    }

    // 🔹 LINKEDIN
    if (text.includes('linkedin'|| text.startsWith('linked') || text === 'scan')) {
      navigate('/linkedin', { replace: true });
      return;
    }

    // 🔹 SCAN
    if (text === 'scan'|| text.startsWith('ats') || text === 'resume') {
      navigate('/scan', { replace: true });
      return;
    }

    // 🔹 SCAN HISTORY
    if (text.includes('history')) {
      navigate('/scan/history', { replace: true });
      return;
    }

    // 🔹 RESUME
    if (text.includes('resume')|| text.startsWith('ats') || text === 'home') {
      navigate('/resume', { replace: true });
      return;
    }

    // 🔹 JOBS
    if (text.includes('job')) {
      navigate('/jobs', { replace: true });
      return;
    }

    // 🔹 FIND JOBS
    if (text.includes('find')) {
      navigate('/find-jobs', { replace: true });
      return;
    }

    // 🔹 INTERVIEW
    if (text.includes('interview')) {
      navigate('/interview', { replace: true });
      return;
    }

    // 🔹 EMAILS
    if (text.includes('email')) {
      navigate('/emails', { replace: true });
      return;
    }

    // 🔹 SETTINGS
    if (text.includes('settings')) {
      navigate('/settings', { replace: true });
      return;
    }

    // 🔹 HELP
    if (text.includes('help')) {
      navigate('/help', { replace: true });
      return;
    }

    
    setFound(false);

  }, [query, navigate]);

  if (!query) return null;

  return (
    <div style={{ padding: 40 }}>
      <h2>Search Result</h2>
      {!found && (
        <p>
          No page found for <strong>"{query}"</strong>
        </p>
      )}
    </div>
  );
}
