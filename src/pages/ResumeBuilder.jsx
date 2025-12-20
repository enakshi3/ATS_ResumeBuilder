import { useState, useRef } from 'react';
import {
    Wand2, Settings2, FileText, Share2, Download, ChevronDown, ChevronUp,
    Minus, Plus, AlignLeft, AlignCenter, AlignJustify, Eye, X,
    MapPin, Mail, Phone, Globe, Linkedin, Edit2, Trash2, PlusCircle,
    Sparkles, Check, Loader2, Copy, FileDown
} from 'lucide-react';
import './ResumeBuilder.css';

// Mock resume data
const initialResumeData = {
    header: {
        name: 'Liza Mohanty',
        title: 'Talent Acquisition Specialist',
        location: 'Bhubaneswar, Odisha, India',
        email: 'hr@saanvinexus.com',
        phone: '+91 6713 56873',
        website: 'www.saanvinexus.com'
    },
    summary: 'Results-driven Talent Acquisition Specialist with expertise in full-cycle recruitment, candidate sourcing, and onboarding optimization. Proven track record of enhancing workforce quality and supporting business expansion through strategic hiring initiatives.',
    experience: [
        {
            id: '1',
            title: 'Talent Acquisition Specialist',
            company: 'Saanvi Nexus',
            location: 'Bhubaneswar, Odisha',
            startDate: 'December 2025',
            endDate: 'Present',
            bullets: [
                'Facilitated full-cycle recruitment processes by sourcing, screening, and advancing top-tier candidates across various departments, enhancing workforce quality and supporting business expansion objectives.',
                'Streamlined onboarding procedures by collaborating with hiring managers and HR teams to ensure a seamless transition for new hires and strong alignment with organizational objectives.',
                'Reduced time-to-hire by 35% through implementation of automated screening tools and optimized interview scheduling.'
            ]
        },
        {
            id: '2',
            title: 'HR Coordinator',
            company: 'TechStart Solutions',
            location: 'Kolkata, India',
            startDate: 'June 2023',
            endDate: 'November 2025',
            bullets: [
                'Managed employee records and HR documentation for 150+ employees.',
                'Coordinated training programs and performance review cycles.',
                'Assisted in recruitment activities including job postings and candidate screening.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Business Administration (HR)',
            institution: 'KIIT University',
            location: 'Bhubaneswar',
            year: '2023'
        },
        {
            id: '2',
            degree: 'Bachelor of Commerce',
            institution: 'Utkal University',
            location: 'Bhubaneswar',
            year: '2021'
        }
    ],
    skills: ['Talent Acquisition', 'Full-Cycle Recruitment', 'ATS Systems', 'Interview Coordination', 'Onboarding', 'HR Management', 'Employee Relations', 'HRIS', 'LinkedIn Recruiting', 'Employer Branding'],
    certifications: [
        { id: '1', name: 'SHRM-CP Certified Professional', issuer: 'SHRM', year: '2024' },
        { id: '2', name: 'LinkedIn Recruiter Certification', issuer: 'LinkedIn', year: '2023' }
    ]
};

const fonts = ['Merriweather', 'Inter', 'Roboto', 'Lato', 'Open Sans', 'Playfair Display'];
const pageSizes = ['Letter', 'A4'];
const templates = [
    { id: 'classic', name: 'Classic', description: 'Traditional professional format' },
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }
];

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState(initialResumeData);
    const [settings, setSettings] = useState({
        font: 'Merriweather',
        fontSize: 11,
        lineSpacing: 1.5,
        margins: 1,
        pageSize: 'Letter',
        zoom: 85,
        viewAsPages: true
    });
    const [activeTemplate, setActiveTemplate] = useState('classic');
    const [lastSaved, setLastSaved] = useState(new Date());
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showAdjustmentsModal, setShowAdjustmentsModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationComplete, setOptimizationComplete] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [jdText, setJdText] = useState('');
    const [showJdPanel, setShowJdPanel] = useState(false);
    const resumeRef = useRef(null);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const updateHeader = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            header: { ...prev.header, [field]: value }
        }));
        autoSave();
    };

    const updateSummary = (value) => {
        setResumeData(prev => ({ ...prev, summary: value }));
        autoSave();
    };

    const updateExperience = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
        autoSave();
    };

    const updateBullet = (expId, bulletIndex, value) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => {
                if (exp.id === expId) {
                    const newBullets = [...exp.bullets];
                    newBullets[bulletIndex] = value;
                    return { ...exp, bullets: newBullets };
                }
                return exp;
            })
        }));
        autoSave();
    };

    const addBullet = (expId) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => {
                if (exp.id === expId) {
                    return { ...exp, bullets: [...exp.bullets, ''] };
                }
                return exp;
            })
        }));
    };

    const removeBullet = (expId, bulletIndex) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => {
                if (exp.id === expId) {
                    return { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) };
                }
                return exp;
            })
        }));
    };

    const autoSave = () => {
        setLastSaved(new Date());
    };

    const formatLastSaved = () => {
        const diff = Math.floor((new Date() - lastSaved) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        return lastSaved.toLocaleTimeString();
    };

    const handleAutoAdjust = () => {
        setIsOptimizing(true);
        setOptimizationComplete(false);

        // Simulate AI optimization
        setTimeout(() => {
            // Enhanced summary
            setResumeData(prev => ({
                ...prev,
                summary: 'Dynamic Talent Acquisition Specialist with 3+ years of experience in strategic recruitment, employer branding, and workforce planning. Expert in leveraging ATS systems and data-driven approaches to reduce time-to-hire by 35% while maintaining quality-of-hire metrics. Passionate about building diverse, high-performing teams aligned with organizational objectives.',
                experience: prev.experience.map((exp, i) => {
                    if (i === 0) {
                        return {
                            ...exp,
                            bullets: [
                                'Spearheaded full-cycle recruitment for 50+ positions annually, achieving 95% offer acceptance rate through strategic candidate engagement and employer branding initiatives.',
                                'Implemented AI-powered screening tools that reduced time-to-hire by 35% while improving candidate quality scores by 25%.',
                                'Developed and executed diversity hiring programs, increasing underrepresented group hires by 40% within one year.',
                                'Collaborated with C-suite executives to align talent acquisition strategies with business growth objectives, supporting 30% workforce expansion.'
                            ]
                        };
                    }
                    return exp;
                })
            }));

            setIsOptimizing(false);
            setOptimizationComplete(true);
            autoSave();

            setTimeout(() => setOptimizationComplete(false), 3000);
        }, 2500);
    };

    const handleDownload = (format) => {
        // Simulate download
        const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.header.name.replace(/\s+/g, '_')}_Resume.${format.toLowerCase()}`;
        a.click();
        URL.revokeObjectURL(url);
        setShowDownloadModal(false);
    };

    return (
        <div className="resume-builder-page">
            {/* Action Bar */}
            <div className="action-bar">
                <div className="action-bar-left">
                    <button
                        className={`action-btn ${isOptimizing ? 'loading' : ''} ${optimizationComplete ? 'success' : ''}`}
                        onClick={handleAutoAdjust}
                        disabled={isOptimizing}
                    >
                        {isOptimizing ? <Loader2 size={16} className="spin" /> :
                            optimizationComplete ? <Check size={16} /> : <Wand2 size={16} />}
                        {isOptimizing ? 'OPTIMIZING...' : optimizationComplete ? 'OPTIMIZED!' : 'AUTO-ADJUST'}
                    </button>
                    <button className="action-btn" onClick={() => setShowAdjustmentsModal(true)}>
                        <Settings2 size={16} />
                        ADJUSTMENTS
                    </button>
                    <button className="action-btn" onClick={() => setShowTemplateModal(true)}>
                        <FileText size={16} />
                        TEMPLATE
                    </button>
                </div>
                <div className="action-bar-right">
                    <button className="action-btn secondary">
                        <Share2 size={16} />
                        SHARE
                    </button>
                    <button className="action-btn primary" onClick={() => setShowDownloadModal(true)}>
                        <Download size={16} />
                        DOWNLOAD PDF
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Format Bar */}
            <div className="format-bar">
                <div className="format-group">
                    <select
                        className="format-select"
                        value={settings.font}
                        onChange={(e) => updateSetting('font', e.target.value)}
                    >
                        {fonts.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="format-group font-size">
                    <button
                        className="format-icon-btn"
                        onClick={() => updateSetting('fontSize', Math.max(8, settings.fontSize - 1))}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="format-value">{settings.fontSize}</span>
                    <button
                        className="format-icon-btn"
                        onClick={() => updateSetting('fontSize', Math.min(16, settings.fontSize + 1))}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="format-divider" />

                <div className="format-group">
                    <span className="format-label">Line</span>
                    <select
                        className="format-select small"
                        value={settings.lineSpacing}
                        onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                    >
                        {[1.0, 1.15, 1.5, 1.75, 2.0].map(v => (
                            <option key={v} value={v}>{v.toFixed(2)}</option>
                        ))}
                    </select>
                </div>

                <div className="format-group">
                    <span className="format-label">Margin</span>
                    <select
                        className="format-select small"
                        value={settings.margins}
                        onChange={(e) => updateSetting('margins', parseFloat(e.target.value))}
                    >
                        {[0.5, 0.75, 1.0, 1.25, 1.5].map(v => (
                            <option key={v} value={v}>{v.toFixed(2)}</option>
                        ))}
                    </select>
                </div>

                <div className="format-divider" />

                <div className="format-group">
                    <select
                        className="format-select small"
                        value={settings.pageSize}
                        onChange={(e) => updateSetting('pageSize', e.target.value)}
                    >
                        {pageSizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="format-group">
                    <button
                        className="format-icon-btn"
                        onClick={() => updateSetting('zoom', Math.max(50, settings.zoom - 10))}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="format-value">{settings.zoom}%</span>
                    <button
                        className="format-icon-btn"
                        onClick={() => updateSetting('zoom', Math.min(150, settings.zoom + 10))}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="format-group toggle-group">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.viewAsPages}
                            onChange={(e) => updateSetting('viewAsPages', e.target.checked)}
                        />
                        <span className="toggle-slider-small"></span>
                    </label>
                    <span className="toggle-label">VIEW AS PAGES</span>
                </div>

                <div className="last-saved">
                    Last Saved: {formatLastSaved()}
                </div>
            </div>

            {/* Main Content */}
            <div className="builder-content">
                {/* Resume Canvas */}
                <div className="resume-canvas">
                    <div
                        ref={resumeRef}
                        className={`resume-paper template-${activeTemplate}`}
                        style={{
                            fontFamily: settings.font,
                            fontSize: `${settings.fontSize}pt`,
                            lineHeight: settings.lineSpacing,
                            padding: `${settings.margins}in`,
                            transform: `scale(${settings.zoom / 100})`,
                            transformOrigin: 'top center'
                        }}
                    >
                        {/* Header */}
                        <div className="resume-header">
                            <h1
                                className="resume-name editable"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateHeader('name', e.target.textContent)}
                            >
                                {resumeData.header.name}
                            </h1>
                            <div className="resume-contact">
                                <span><MapPin size={12} /> {resumeData.header.location}</span>
                                <span><Mail size={12} /> {resumeData.header.email}</span>
                                <span><Phone size={12} /> {resumeData.header.phone}</span>
                                <span><Globe size={12} /> {resumeData.header.website}</span>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="resume-section">
                            <h2 className="section-title">SUMMARY</h2>
                            <p
                                className="summary-text editable"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateSummary(e.target.textContent)}
                            >
                                {resumeData.summary}
                            </p>
                        </div>

                        {/* Experience */}
                        <div className="resume-section">
                            <h2 className="section-title">EXPERIENCE</h2>
                            {resumeData.experience.map((exp) => (
                                <div key={exp.id} className="experience-entry">
                                    <div className="exp-header">
                                        <div className="exp-left">
                                            <h3 className="exp-title">{exp.title}</h3>
                                            <span className="exp-company">{exp.company}</span>
                                        </div>
                                        <div className="exp-right">
                                            <span className="exp-dates">{exp.startDate} - {exp.endDate}</span>
                                            <span className="exp-location">{exp.location}</span>
                                        </div>
                                    </div>
                                    <ul className="exp-bullets">
                                        {exp.bullets.map((bullet, i) => (
                                            <li
                                                key={i}
                                                className="editable"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => updateBullet(exp.id, i, e.target.textContent)}
                                            >
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="resume-section">
                            <h2 className="section-title">EDUCATION</h2>
                            {resumeData.education.map((edu) => (
                                <div key={edu.id} className="education-entry">
                                    <div className="edu-header">
                                        <h3 className="edu-degree">{edu.degree}</h3>
                                        <span className="edu-year">{edu.year}</span>
                                    </div>
                                    <span className="edu-institution">{edu.institution}, {edu.location}</span>
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        {resumeData.certifications && resumeData.certifications.length > 0 && (
                            <div className="resume-section">
                                <h2 className="section-title">CERTIFICATIONS</h2>
                                {resumeData.certifications.map((cert) => (
                                    <div key={cert.id} className="cert-entry">
                                        <span className="cert-name">{cert.name}</span>
                                        <span className="cert-details">{cert.issuer}, {cert.year}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills */}
                        <div className="resume-section">
                            <h2 className="section-title">SKILLS</h2>
                            <div className="skills-list">
                                {resumeData.skills.join(' • ')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Modal */}
            {showTemplateModal && (
                <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Choose Template</h3>
                            <button className="modal-close" onClick={() => setShowTemplateModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="template-grid">
                            {templates.map(t => (
                                <div
                                    key={t.id}
                                    className={`template-card ${activeTemplate === t.id ? 'active' : ''}`}
                                    onClick={() => { setActiveTemplate(t.id); setShowTemplateModal(false); }}
                                >
                                    <div className={`template-preview ${t.id}`}></div>
                                    <h4>{t.name}</h4>
                                    <p>{t.description}</p>
                                    {activeTemplate === t.id && <Check size={20} className="template-check" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Download Modal */}
            {showDownloadModal && (
                <div className="modal-overlay" onClick={() => setShowDownloadModal(false)}>
                    <div className="modal small" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Download Resume</h3>
                            <button className="modal-close" onClick={() => setShowDownloadModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="download-options">
                            <button className="download-option" onClick={() => handleDownload('PDF')}>
                                <FileDown size={24} />
                                <div>
                                    <h4>PDF</h4>
                                    <p>Best for applications</p>
                                </div>
                            </button>
                            <button className="download-option" onClick={() => handleDownload('DOCX')}>
                                <FileText size={24} />
                                <div>
                                    <h4>DOCX</h4>
                                    <p>Editable Word format</p>
                                </div>
                            </button>
                            <button className="download-option" onClick={() => handleDownload('TXT')}>
                                <FileText size={24} />
                                <div>
                                    <h4>TXT</h4>
                                    <p>Plain text format</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Adjustments Modal */}
            {showAdjustmentsModal && (
                <div className="modal-overlay" onClick={() => setShowAdjustmentsModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Resume Adjustments</h3>
                            <button className="modal-close" onClick={() => setShowAdjustmentsModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="adjustments-content">
                            <div className="adjustment-group">
                                <label>Target Job Description</label>
                                <textarea
                                    placeholder="Paste the job description here for AI-powered optimization..."
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    rows={6}
                                />
                            </div>
                            <div className="adjustment-group">
                                <label>Writing Tone</label>
                                <select defaultValue="professional">
                                    <option value="professional">Professional</option>
                                    <option value="confident">Confident</option>
                                    <option value="creative">Creative</option>
                                    <option value="technical">Technical</option>
                                </select>
                            </div>
                            <div className="adjustment-group">
                                <label>Resume Length</label>
                                <select defaultValue="2">
                                    <option value="1">1 Page (Concise)</option>
                                    <option value="2">2 Pages (Standard)</option>
                                    <option value="3">3+ Pages (Detailed)</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={() => { handleAutoAdjust(); setShowAdjustmentsModal(false); }}>
                                <Wand2 size={18} />
                                Apply AI Optimization
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
