import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Target,
    Briefcase,
    FileText,
    ScanSearch,
    ArrowRight,
    Zap,
    CheckCircle,
    Clock,
    Star
} from 'lucide-react';
import { api } from '../api/client';
import './Dashboard.css';

const quickActions = [
    { id: 1, label: 'New ATS Scan', icon: ScanSearch, path: '/scan', color: 'purple' },
    { id: 2, label: 'Build Resume', icon: FileText, path: '/resume', color: 'cyan' },
    { id: 3, label: 'Track Job', icon: Briefcase, path: '/jobs', color: 'green' },
    { id: 4, label: 'AI Improve', icon: Zap, path: '/scan', color: 'orange' },
];

const onboardingTasks = [
    { id: 1, task: 'Upload your resume', completed: true },
    { id: 2, task: 'Run your first ATS scan', completed: false },
    { id: 3, task: 'Add a job to tracker', completed: false },
    { id: 4, task: 'Connect LinkedIn', completed: false },
    { id: 5, task: 'Generate cover letter', completed: false },
];

function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-work';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalScans: 0,
        averageScore: 0,
        jobsTracked: 0,
        resumesCount: 0
    });
    const [recentScans, setRecentScans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real data from API on mount
    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setIsLoading(true);

                // Fetch stats and scans in parallel
                const [statsRes, scansRes] = await Promise.all([
                    api.get('/user/stats'),
                    api.get('/scans')
                ]);

                if (statsRes.success) {
                    setStats(statsRes.data);
                }

                if (scansRes.success) {
                    // Take only the 4 most recent scans
                    setRecentScans(scansRes.data.slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    // Build stats array for display
    const statsDisplay = [
        { id: 1, label: 'Total Scans', value: stats.totalScans.toString(), icon: ScanSearch, change: `${stats.scansThisMonth || 0} this month`, color: 'purple' },
        { id: 2, label: 'Average Score', value: `${stats.averageScore}%`, icon: Target, change: stats.averageScore >= 70 ? 'Good' : 'Improve', color: 'cyan' },
        { id: 3, label: 'Jobs Tracked', value: stats.jobsTracked.toString(), icon: Briefcase, change: 'Active', color: 'green' },
        { id: 4, label: 'Resumes', value: stats.resumesCount.toString(), icon: FileText, change: 'Saved', color: 'orange' },
    ];

    const completedTasks = onboardingTasks.filter(t => t.completed).length;
    const progress = (completedTasks / onboardingTasks.length) * 100;

    return (
        <div className="dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back! 👋</h1>
                    <p>Your career copilot is ready. Let's optimize your job search today.</p>
                </div>
                <div className="welcome-actions">
                    <a href="/scan" className="btn btn-primary">
                        <ScanSearch size={18} />
                        New ATS Scan
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsDisplay.map((stat) => (
                    <div key={stat.id} className={`stat-card stat-${stat.color}`}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{isLoading ? '...' : stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                        <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : ''}`}>
                            <TrendingUp size={14} />
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Quick Actions */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions">
                        {quickActions.map((action) => (
                            <a key={action.id} href={action.path} className={`quick-action action-${action.color}`}>
                                <div className="action-icon">
                                    <action.icon size={22} />
                                </div>
                                <span>{action.label}</span>
                                <ArrowRight size={16} className="action-arrow" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Recent Scans */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3>Recent Scans</h3>
                        <a href="/scan/history" className="view-all">View All</a>
                    </div>
                    <div className="recent-scans">
                        {isLoading ? (
                            <div className="empty-state">Loading...</div>
                        ) : recentScans.length === 0 ? (
                            <div className="empty-state">
                                <p>No scans yet. Run your first ATS scan!</p>
                                <a href="/scan" className="btn btn-primary btn-sm">Start Scan</a>
                            </div>
                        ) : (
                            recentScans.map((scan) => (
                                <div key={scan._id || scan.id} className="scan-item">
                                    <div className="scan-info">
                                        <div className="scan-job">{scan.jobTitle}</div>
                                        <div className="scan-company">{scan.company || 'Company'}</div>
                                    </div>
                                    <div className="scan-meta">
                                        <div className={`scan-score score-${getScoreClass(scan.results?.overallScore || 0)}`}>
                                            {scan.results?.overallScore || 0}%
                                        </div>
                                        <div className="scan-date">
                                            <Clock size={12} />
                                            {formatDate(scan.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Onboarding Progress */}
                <div className="dashboard-section onboarding-section">
                    <div className="section-header">
                        <h3>Getting Started</h3>
                        <span className="progress-text">{completedTasks}/{onboardingTasks.length}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="onboarding-tasks">
                        {onboardingTasks.map((task) => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <div className="task-check">
                                    {task.completed ? <CheckCircle size={18} /> : <div className="task-circle" />}
                                </div>
                                <span>{task.task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

