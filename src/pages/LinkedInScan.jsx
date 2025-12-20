import { useState } from 'react';
import { Linkedin, Search, CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import './LinkedInScan.css';

export default function LinkedInScan() {
    const [profileUrl, setProfileUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleAnalyze = () => {
        if (profileUrl.includes('linkedin.com')) {
            setIsAnalyzing(true);
            setTimeout(() => {
                setResults({
                    score: 72,
                    sections: {
                        headline: { score: 85, status: 'good' },
                        summary: { score: 60, status: 'warning' },
                        experience: { score: 80, status: 'good' },
                        skills: { score: 65, status: 'warning' },
                        connections: { score: 75, status: 'good' }
                    },
                    suggestions: [
                        'Add more keywords to your headline',
                        'Expand your summary with achievements',
                        'Request more skill endorsements',
                        'Add media to your experience section'
                    ]
                });
                setIsAnalyzing(false);
            }, 2000);
        }
    };

    return (
        <div className="linkedin-scan-page">
            <div className="page-header">
                <h1 className="page-title">LinkedIn Profile Analyzer</h1>
                <p className="page-subtitle">Get AI-powered insights to optimize your LinkedIn profile</p>
            </div>

            <div className="linkedin-input-card">
                <div className="input-section">
                    <label className="label"><Linkedin size={18} /> LinkedIn Profile URL</label>
                    <div className="url-input">
                        <input
                            type="url"
                            className="input"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={profileUrl}
                            onChange={(e) => setProfileUrl(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !profileUrl}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {results && (
                <div className="linkedin-results">
                    <div className="results-header">
                        <div className="score-circle">
                            <span className="score-value">{results.score}</span>
                            <span className="score-label">Profile Score</span>
                        </div>
                        <div className="score-breakdown">
                            {Object.entries(results.sections).map(([key, value]) => (
                                <div key={key} className="breakdown-item">
                                    <span className="breakdown-label">{key}</span>
                                    <div className="breakdown-bar">
                                        <div className={`breakdown-fill status-${value.status}`} style={{ width: `${value.score}%` }}></div>
                                    </div>
                                    <span className="breakdown-score">{value.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="suggestions-section">
                        <h3><Lightbulb size={20} /> Improvement Suggestions</h3>
                        <div className="suggestions-list">
                            {results.suggestions.map((suggestion, i) => (
                                <div key={i} className="suggestion-item">
                                    <TrendingUp size={18} />
                                    <span>{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
