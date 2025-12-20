import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Search,
    Menu,
    X,
    Command,
    ChevronDown
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();

    // Get page title based on current route
    const getPageTitle = () => {
        const routes = {
            '/': 'Dashboard',
            '/scan': 'New ATS Scan',
            '/builder': 'Resume Builder',
            '/linkedin': 'LinkedIn Scan',
            '/jobs': 'Job Tracker',
            '/find-jobs': 'Find Jobs',
            '/history': 'Scan History',
            '/settings': 'Settings',
            '/help': 'Help & Support',
            '/tools/cover-letter': 'Cover Letter Generator',
            '/tools/emails': 'Email Templates',
            '/tools/interview': 'Interview Prep',
        };
        return routes[location.pathname] || 'Dashboard';
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <Sidebar />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="mobile-menu-btn hide-desktop"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="page-title-container">
                            <h1 className="page-title">{getPageTitle()}</h1>
                            <div className="breadcrumb">
                                <span>Home</span>
                                <ChevronDown size={12} className="breadcrumb-separator" />
                                <span className="current">{getPageTitle()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="header-right">
                        {/* Global Search */}
                        <div className={`global-search ${isSearchOpen ? 'open' : ''}`}>
                            <div className="search-input-wrapper">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="search-input"
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setIsSearchOpen(false)}
                                />
                                <div className="search-shortcut">
                                    <Command size={12} />
                                    <span>K</span>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <button className="header-action-btn" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="notification-badge">3</span>
                        </button>

                        {/* User Menu */}
                        <button className="user-menu-btn">
                            <div className="user-menu-avatar">J</div>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dashboard-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="page-container"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
