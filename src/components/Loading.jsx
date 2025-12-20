/**
 * Saanvi ResumeATS - Loading Components
 * Skeleton loaders and spinners for better UX
 */

import { motion } from 'framer-motion';
import './Loading.css';

// Spinning loader
export function Spinner({ size = 24, className = '' }) {
    return (
        <div className={`spinner ${className}`} style={{ width: size, height: size }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                />
                <path
                    d="M12 2C6.48 2 2 6.48 2 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

// Full page loading
export function PageLoader({ message = 'Loading...' }) {
    return (
        <div className="page-loader">
            <div className="loader-content">
                <Spinner size={48} />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {message}
                </motion.p>
            </div>
        </div>
    );
}

// Skeleton components
export function Skeleton({ width, height, radius = 'md', className = '' }) {
    return (
        <div
            className={`skeleton radius-${radius} ${className}`}
            style={{ width, height }}
        />
    );
}

export function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '60%' : '100%'}
                    height={14}
                    radius="sm"
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className = '' }) {
    return (
        <div className={`skeleton-card ${className}`}>
            <Skeleton width={48} height={48} radius="lg" />
            <div className="skeleton-card-content">
                <Skeleton width="70%" height={16} radius="sm" />
                <Skeleton width="40%" height={12} radius="sm" />
            </div>
        </div>
    );
}

// Dashboard stat skeleton
export function SkeletonStat() {
    return (
        <div className="skeleton-stat">
            <Skeleton width={48} height={48} radius="lg" />
            <div className="skeleton-stat-content">
                <Skeleton width={80} height={12} radius="sm" />
                <Skeleton width={60} height={24} radius="sm" />
                <Skeleton width={100} height={10} radius="sm" />
            </div>
        </div>
    );
}

// Job card skeleton
export function SkeletonJobCard() {
    return (
        <div className="skeleton-job-card">
            <Skeleton width={36} height={36} radius="md" />
            <div style={{ flex: 1 }}>
                <Skeleton width="80%" height={14} radius="sm" />
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <Skeleton width={60} height={10} radius="sm" />
                    <Skeleton width={80} height={10} radius="sm" />
                </div>
            </div>
        </div>
    );
}

// Loading button state
export function ButtonLoader({ children, isLoading, ...props }) {
    return (
        <button {...props} disabled={isLoading || props.disabled}>
            {isLoading ? (
                <>
                    <Spinner size={18} />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}

// Animated progress bar
export function ProgressBar({ progress, showLabel = false, className = '' }) {
    return (
        <div className={`progress-container ${className}`}>
            <div className="progress-track">
                <motion.div
                    className="progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
            {showLabel && <span className="progress-label">{Math.round(progress)}%</span>}
        </div>
    );
}
