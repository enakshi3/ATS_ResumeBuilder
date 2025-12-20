import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ScanSearch,
    FileEdit,
    Linkedin,
    Briefcase,
    Search,
    History,
    Zap,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    FileText,
    Mail,
    MessageSquare,
    LogOut,
    User,
    Crown
} from 'lucide-react';
import './Sidebar.css';

const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ScanSearch, label: 'New ATS Scan', path: '/scan', badge: 'AI' },
    { icon: FileEdit, label: 'Resume Builder', path: '/resume' },
    { icon: Linkedin, label: 'LinkedIn Scan', path: '/linkedin' },
    { icon: Briefcase, label: 'Job Tracker', path: '/jobs' },
    { icon: Search, label: 'Find Jobs', path: '/find-jobs' },
    { icon: History, label: 'Scan History', path: '/scan/history' },
];

const quickToolItems = [
    { icon: FileText, label: 'Cover Letter', path: '/cover-letter' },
    { icon: Mail, label: 'Email Templates', path: '/emails' },
    { icon: MessageSquare, label: 'Interview Prep', path: '/interview' },
];

const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.aside
            className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Logo */}
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <Sparkles size={24} />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                className="logo-text"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="logo-title">Saanvi</span>
                                <span className="logo-subtitle">ResumeATS</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    {mainNavItems.map((item) => (
                        <NavItem
                            key={item.path}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </div>

                {/* Quick Tools Section */}
                <div className="nav-section">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                className="nav-section-title"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Zap size={14} />
                                Quick Tools
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {quickToolItems.map((item) => (
                        <NavItem
                            key={item.path}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </div>
            </nav>

            {/* Pro Upgrade Card */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        className="upgrade-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="upgrade-icon">
                            <Crown size={20} />
                        </div>
                        <div className="upgrade-content">
                            <span className="upgrade-title">Upgrade to Pro</span>
                            <span className="upgrade-text">Unlock unlimited scans</span>
                        </div>
                        <button className="btn btn-accent btn-sm">Upgrade</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div className="sidebar-footer">
                {bottomNavItems.map((item) => (
                    <NavItem
                        key={item.path}
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={location.pathname === item.path}
                    />
                ))}

                {/* User Profile */}
                <div className="user-profile">
                    <div className="user-avatar">
                        <User size={18} />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                className="user-info"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <span className="user-name">{user?.name || 'User'}</span>
                                <span className="user-plan">{user?.email || 'Free Plan'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button className="logout-btn" aria-label="Log out" onClick={handleLogout}>
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}

function NavItem({ item, isCollapsed, isActive }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            data-tooltip={isCollapsed ? item.label : undefined}
        >
            <div className="nav-icon">
                <Icon size={20} />
            </div>
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span
                        className="nav-label"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
            {item.badge && !isCollapsed && (
                <span className="nav-badge">{item.badge}</span>
            )}
            {isActive && (
                <motion.div
                    className="nav-active-indicator"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
            )}
        </NavLink>
    );
}
