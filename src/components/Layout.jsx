import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ScanSearch,
    FileEdit,
    Linkedin,
    Briefcase,
    Search,
    History,
    FileText,
    Mail,
    MessageSquare,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    User,
    Bell,
    LogOut,
    Crown,
    Zap
} from 'lucide-react';
import './Layout.css';

const mainNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ScanSearch, label: 'New ATS Scan', path: '/scan', badge: 'AI' },
    { icon: FileEdit, label: 'Resume Builder', path: '/resume' },
    { icon: Linkedin, label: 'LinkedIn Scan', path: '/linkedin' },
    { icon: Briefcase, label: 'Job Tracker', path: '/jobs' },
    { icon: Search, label: 'Find Jobs', path: '/find-jobs' },
    { icon: History, label: 'Scan History', path: '/scan/history' },
];

const quickTools = [
    { icon: FileText, label: 'Cover Letter', path: '/cover-letter' },
    { icon: Mail, label: 'Email Templates', path: '/emails' },
    { icon: MessageSquare, label: 'Interview Prep', path: '/interview' },
];

const bottomNav = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
];

const searchSuggestions = [
    'ATS Resume Scan',
    'Resume Builder',
    'Cover Letter',
    'Job Tracker',
    'LinkedIn Scan',
    'Interview Preparation'
];

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const searchRef = useRef(null);

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDialog(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSuggestions = searchSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <Sparkles size={24} />
                        </div>
                        {!collapsed && (
                            <div className="logo-text">
                                <span className="logo-title">Saanvi</span>
                                <span className="logo-subtitle">ResumeATS</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        {mainNav.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
                                {item.badge && !collapsed && (
                                    <span className="nav-badge">{item.badge}</span>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <div className="nav-section">
                        {!collapsed && (
                            <div className="nav-section-title">
                                <Zap size={14} />
                                Quick Tools
                            </div>
                        )}
                        {quickTools.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {!collapsed && (
                    <div className="upgrade-card">
                        <Crown size={20} />
                        <div className="upgrade-content">
                            <span className="upgrade-title">Upgrade to Pro</span>
                            <span className="upgrade-text">Unlimited scans</span>
                        </div>
                        <button className="upgrade-btn">Upgrade</button>
                    </div>
                )}

                <div className="sidebar-footer">
                    {bottomNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}

                    <div className="user-profile">
                        <div className="user-avatar">
                            <User size={18} />
                        </div>
                        {!collapsed && (
                            <div className="user-info">
                                <span className="user-name">{user?.name || 'User'}</span>
                                <span className="user-plan">{user?.email || 'Free Plan'}</span>
                            </div>
                        )}
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="main-header">
                    <div className="header-search" ref={searchRef}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDialog(true);
                            }}
                            onFocus={() => setShowDialog(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                    setShowDialog(false);
                                }
                            }}
                        />

                        {showDialog && searchQuery && (
                            <div className="search-dialog">
                                {filteredSuggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="search-item"
                                        onClick={() => {
                                            navigate(`/search?q=${encodeURIComponent(item)}`);
                                            setSearchQuery('');
                                            setShowDialog(false);
                                        }}
                                    >
                                        <Search size={14} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="header-actions">
                        <button className="header-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <div className="header-user">
                            <div className="user-avatar small">
                                <User size={16} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
