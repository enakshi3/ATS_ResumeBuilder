import { Clock, Eye, Trash2, Download } from 'lucide-react';
import './ScanHistory.css';

const mockScans = [
    { id: 1, job: 'Senior Frontend Developer', company: 'Google', score: 85, date: '2024-01-15', status: 'excellent' },
    { id: 2, job: 'Product Manager', company: 'Microsoft', score: 72, date: '2024-01-14', status: 'good' },
    { id: 3, job: 'UX Designer', company: 'Apple', score: 58, date: '2024-01-12', status: 'needs-work' },
    { id: 4, job: 'Full Stack Developer', company: 'Netflix', score: 91, date: '2024-01-10', status: 'excellent' },
    { id: 5, job: 'Software Engineer', company: 'Amazon', score: 67, date: '2024-01-08', status: 'good' },
    { id: 6, job: 'DevOps Engineer', company: 'Meta', score: 45, date: '2024-01-05', status: 'needs-work' },
];

function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-work';
}

export default function ScanHistory() {
    return (
        <div className="scan-history-page">
            <div className="page-header">
                <h1 className="page-title">Scan History</h1>
                <p className="page-subtitle">View all your past ATS scans</p>
            </div>

            <div className="history-list">
                {mockScans.map((scan) => (
                    <div key={scan.id} className="history-item">
                        <div className="history-info">
                            <h4>{scan.job}</h4>
                            <p>{scan.company}</p>
                        </div>
                        <div className={`history-score score-${getScoreClass(scan.score)}`}>
                            {scan.score}%
                        </div>
                        <div className="history-date">
                            <Clock size={14} />
                            {scan.date}
                        </div>
                        <div className="history-actions">
                            <button className="action-btn" title="View">
                                <Eye size={16} />
                            </button>
                            <button className="action-btn" title="Download">
                                <Download size={16} />
                            </button>
                            <button className="action-btn delete" title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
