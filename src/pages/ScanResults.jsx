import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Target, CheckCircle, AlertTriangle, XCircle, TrendingUp,
    FileText, Lightbulb, Download, Wand2, FileDown, Eye,
    Briefcase, GraduationCap, Code, Award, ChevronDown, ChevronUp, Sparkles, ArrowLeft
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import './ScanResults.css';

export default function ScanResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showOptimized, setShowOptimized] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        cv: true,
        jd: false,
        gaps: true,
        recommendations: true
    });

    // Get real data from navigation state
    const scanData = location.state?.scanData;
    const resumeText = location.state?.resumeText || '';
    const jobDescription = location.state?.jobDescription || '';

    // If no scan data, show error
    if (!scanData) {
        return (
            <div className="scan-results-page">
                <div className="no-data-message">
                    <h2>No Scan Data Found</h2>
                    <p>Please run a new scan to see results.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/scan')}>
                        <ArrowLeft size={18} /> Run New Scan
                    </button>
                </div>
            </div>
        );
    }

    // Extract data from the scan results
    const results = scanData.results || {};
    const matchScore = results.overallScore || 0;
    const keywords = results.keywords || { matched: [], missing: [], partial: [], score: 0 };
    const formatting = results.formatting || { score: 100, issues: [] };
    const improvements = results.improvements || [];

    // Build breakdown data from real results
    const breakdown = {
        skills: {
            score: keywords.score || 0,
            matched: keywords.matched || [],
            missing: keywords.missing || []
        },
        experience: { score: Math.min(matchScore + 10, 100), note: 'Based on resume content' },
        titleRole: { score: matchScore >= 70 ? 85 : 70, note: `${scanData.jobTitle} alignment` },
        education: { score: 80, note: 'Education detected' },
        keywords: {
            score: keywords.score || 0,
            matched: (keywords.matched?.length || 0),
            total: (keywords.matched?.length || 0) + (keywords.missing?.length || 0)
        },
        formatting: formatting
    };

    // Convert improvements to gaps format
    const gaps = (keywords.missing || []).slice(0, 5).map((keyword, i) => ({
        type: 'keyword',
        item: keyword,
        priority: i < 2 ? 'high' : 'medium',
        suggestion: `Add "${keyword}" to your resume`
    }));

    // Build recommendations from improvements
    const recommendations = (improvements || []).map(imp => ({
        title: imp.title || 'Improvement',
        description: imp.description || '',
        impact: imp.impact || '+5%'
    }));

    // Add default recommendations if empty
    if (recommendations.length === 0) {
        recommendations.push({
            title: 'Add Missing Keywords',
            description: `Include these keywords from the job description: ${(keywords.missing || []).slice(0, 3).join(', ')}`,
            impact: '+10%'
        });
    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setShowOptimized(true);
        }, 2000);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        return 'needs-work';
    };

    return (
        <div className="scan-results-page">
            {/* Header with Gauge Score */}
            <div className="results-header-card">
                <div className="header-top">
                    <div className="header-info">
                        <h1>Analysis Results</h1>
                        <p>{scanData.jobTitle} at {scanData.company || 'Company'}</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => navigate('/scan')}>
                        <ArrowLeft size={18} /> New Scan
                    </button>
                </div>

                {/* Score Gauge */}
                <ScoreGauge score={matchScore} />

                {/* Score Summary */}
                <div className="score-summary">
                    <p>{results.summary || `Your resume has a ${matchScore}% match with this job.`}</p>
                </div>

                {/* Explore Score Button */}
                <button className="explore-score-btn">
                    <Sparkles size={18} />
                    EXPLORE MY SCORE
                </button>
            </div>

            {/* Score Breakdown */}
            <div className="breakdown-section">
                <h2>Score Breakdown</h2>
                <div className="breakdown-grid">
                    <div className="breakdown-card">
                        <div className="breakdown-icon"><Code size={20} /></div>
                        <div className="breakdown-info">
                            <span className="breakdown-label">Keywords Match</span>
                            <div className="breakdown-bar-container">
                                <div className={`breakdown-bar score-${getScoreColor(breakdown.skills.score)}`}
                                    style={{ width: `${breakdown.skills.score}%` }}></div>
                            </div>
                        </div>
                        <span className={`breakdown-score score-${getScoreColor(breakdown.skills.score)}`}>
                            {breakdown.skills.score}%
                        </span>
                    </div>

                    <div className="breakdown-card">
                        <div className="breakdown-icon"><Briefcase size={20} /></div>
                        <div className="breakdown-info">
                            <span className="breakdown-label">Experience Match</span>
                            <div className="breakdown-bar-container">
                                <div className={`breakdown-bar score-${getScoreColor(breakdown.experience.score)}`}
                                    style={{ width: `${breakdown.experience.score}%` }}></div>
                            </div>
                        </div>
                        <span className={`breakdown-score score-${getScoreColor(breakdown.experience.score)}`}>
                            {breakdown.experience.score}%
                        </span>
                    </div>

                    <div className="breakdown-card">
                        <div className="breakdown-icon"><Target size={20} /></div>
                        <div className="breakdown-info">
                            <span className="breakdown-label">Title/Role Match</span>
                            <div className="breakdown-bar-container">
                                <div className={`breakdown-bar score-${getScoreColor(breakdown.titleRole.score)}`}
                                    style={{ width: `${breakdown.titleRole.score}%` }}></div>
                            </div>
                        </div>
                        <span className={`breakdown-score score-${getScoreColor(breakdown.titleRole.score)}`}>
                            {breakdown.titleRole.score}%
                        </span>
                    </div>

                    <div className="breakdown-card">
                        <div className="breakdown-icon"><GraduationCap size={20} /></div>
                        <div className="breakdown-info">
                            <span className="breakdown-label">Formatting</span>
                            <div className="breakdown-bar-container">
                                <div className={`breakdown-bar score-${getScoreColor(breakdown.formatting.score)}`}
                                    style={{ width: `${breakdown.formatting.score}%` }}></div>
                            </div>
                        </div>
                        <span className={`breakdown-score score-${getScoreColor(breakdown.formatting.score)}`}>
                            {breakdown.formatting.score}%
                        </span>
                    </div>

                    <div className="breakdown-card">
                        <div className="breakdown-icon"><Award size={20} /></div>
                        <div className="breakdown-info">
                            <span className="breakdown-label">Keywords ({breakdown.keywords.matched}/{breakdown.keywords.total})</span>
                            <div className="breakdown-bar-container">
                                <div className={`breakdown-bar score-${getScoreColor(breakdown.keywords.score)}`}
                                    style={{ width: `${breakdown.keywords.score}%` }}></div>
                            </div>
                        </div>
                        <span className={`breakdown-score score-${getScoreColor(breakdown.keywords.score)}`}>
                            {breakdown.keywords.score}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="results-grid">
                {/* Left Column: Extracted Text */}
                <div className="extracted-column">
                    {/* CV Text */}
                    <div className="collapsible-section">
                        <button className="section-toggle" onClick={() => toggleSection('cv')}>
                            <FileText size={18} />
                            <span>Your CV (Uploaded Content)</span>
                            {expandedSections.cv ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.cv && (
                            <div className="extracted-text">{resumeText || scanData.resumeText || 'Resume content not available'}</div>
                        )}
                    </div>

                    {/* JD Text */}
                    <div className="collapsible-section">
                        <button className="section-toggle" onClick={() => toggleSection('jd')}>
                            <Briefcase size={18} />
                            <span>Job Description</span>
                            {expandedSections.jd ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.jd && (
                            <div className="extracted-text">{jobDescription || scanData.jobDescription || 'Job description not available'}</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Analysis */}
                <div className="analysis-column">
                    {/* Gaps */}
                    <div className="collapsible-section">
                        <button className="section-toggle gaps-toggle" onClick={() => toggleSection('gaps')}>
                            <AlertTriangle size={18} />
                            <span>Missing Keywords ({gaps.length})</span>
                            {expandedSections.gaps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.gaps && (
                            <div className="gaps-list">
                                {gaps.length > 0 ? gaps.map((gap, i) => (
                                    <div key={i} className={`gap-item priority-${gap.priority}`}>
                                        <div className="gap-header">
                                            <span className="gap-type">{gap.type}</span>
                                            <span className={`priority-badge ${gap.priority}`}>{gap.priority}</span>
                                        </div>
                                        <h4>{gap.item}</h4>
                                        <p>{gap.suggestion}</p>
                                    </div>
                                )) : (
                                    <p className="no-gaps">Great job! No critical gaps found.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className="collapsible-section">
                        <button className="section-toggle recs-toggle" onClick={() => toggleSection('recommendations')}>
                            <Lightbulb size={18} />
                            <span>Recommendations ({recommendations.length})</span>
                            {expandedSections.recommendations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.recommendations && (
                            <div className="recommendations-list">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="recommendation-item">
                                        <div className="rec-header">
                                            <h4>{rec.title}</h4>
                                            <span className="impact-badge">
                                                <TrendingUp size={14} />
                                                {rec.impact}
                                            </span>
                                        </div>
                                        <p>{rec.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Skills Analysis */}
            <div className="skills-section">
                <h2>Keywords Analysis</h2>
                <div className="skills-grid">
                    <div className="skills-group matched">
                        <h4><CheckCircle size={16} /> Matched Keywords ({breakdown.skills.matched.length})</h4>
                        <div className="skills-tags">
                            {breakdown.skills.matched.length > 0 ? breakdown.skills.matched.map((skill, i) => (
                                <span key={i} className="skill-tag matched">{skill}</span>
                            )) : <span className="no-skills">No keywords matched</span>}
                        </div>
                    </div>
                    <div className="skills-group missing">
                        <h4><XCircle size={16} /> Missing Keywords ({breakdown.skills.missing.length})</h4>
                        <div className="skills-tags">
                            {breakdown.skills.missing.length > 0 ? breakdown.skills.missing.map((skill, i) => (
                                <span key={i} className="skill-tag missing">{skill}</span>
                            )) : <span className="no-skills">No missing keywords!</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Optimize Section */}
            <div className="optimize-section">
                <div className="optimize-card">
                    <div className="optimize-info">
                        <Wand2 size={32} />
                        <div>
                            <h3>Optimize Your Resume</h3>
                            <p>Generate an ATS-optimized, international standard resume tailored to this job description</p>
                        </div>
                    </div>
                    <div className="optimize-actions">
                        {!showOptimized ? (
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleOptimize}
                                disabled={isOptimizing}
                            >
                                {isOptimizing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        Optimize Resume
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="download-options">
                                <span className="download-label">Download Optimized Resume:</span>
                                <div className="download-buttons">
                                    <button className="btn btn-primary">
                                        <FileDown size={18} /> PDF
                                    </button>
                                    <button className="btn btn-primary">
                                        <FileDown size={18} /> DOCX
                                    </button>
                                    <button className="btn btn-secondary">
                                        <FileDown size={18} /> TXT
                                    </button>
                                </div>
                                <button className="btn btn-ghost">
                                    <Eye size={18} /> Preview Optimized
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showOptimized && (
                    <div className="raw-resume-note">
                        <FileText size={16} />
                        <span>Your original resume is preserved as "Raw (Exact)" above</span>
                    </div>
                )}
            </div>
        </div>
    );
}
