import './ScoreGauge.css';

export default function ScoreGauge({ score = 78 }) {
    // Calculate indicator position (0-180 degrees for semicircle)
    const angle = (score / 100) * 180;

    // Determine score status
    const getStatus = (score) => {
        if (score >= 70) return { label: 'Great Match', color: 'excellent' };
        if (score >= 40) return { label: 'Good Match', color: 'good' };
        return { label: 'Needs Improvement', color: 'poor' };
    };

    const status = getStatus(score);

    // Calculate indicator position on the arc
    const radius = 120;
    const centerX = 150;
    const centerY = 140;
    const angleRad = ((180 - angle) * Math.PI) / 180;
    const indicatorX = centerX + radius * Math.cos(angleRad);
    const indicatorY = centerY - radius * Math.sin(angleRad);

    return (
        <div className="score-gauge">
            <div className="gauge-container">
                <svg viewBox="0 0 300 180" className="gauge-svg">
                    {/* Background track segments */}
                    {/* Red segment (0-40) */}
                    <path
                        d="M 30 140 A 120 120 0 0 1 78 44"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="24"
                        strokeLinecap="round"
                    />
                    {/* Orange segment (40-70) */}
                    <path
                        d="M 78 44 A 120 120 0 0 1 222 44"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="24"
                        strokeLinecap="round"
                    />
                    {/* Teal segment (70-100) */}
                    <path
                        d="M 222 44 A 120 120 0 0 1 270 140"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="24"
                        strokeLinecap="round"
                    />

                    {/* Score indicator circle */}
                    <circle
                        cx={indicatorX}
                        cy={indicatorY}
                        r="14"
                        fill="white"
                        stroke="#1a1a2e"
                        strokeWidth="3"
                        className="gauge-indicator"
                    />
                </svg>

                {/* Score display in center */}
                <div className="gauge-score">
                    <span className="score-value">{score}</span>
                    <span className={`score-status ${status.color}`}>{status.label}</span>
                </div>

                {/* Scale labels */}
                <div className="gauge-labels">
                    <span className="label-min">0</span>
                    <span className="label-max">100</span>
                </div>
            </div>
        </div>
    );
}
