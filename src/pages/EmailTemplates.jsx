import { useState } from 'react';
import { Mail, Copy, Edit2, Trash2, Plus } from 'lucide-react';
import './EmailTemplates.css';

const mockTemplates = [
    { id: 1, title: 'Follow-up After Interview', subject: 'Thank you for the interview', preview: 'Dear [Hiring Manager], Thank you for taking the time to interview me for the [Position] role...', category: 'Follow-up' },
    { id: 2, title: 'Application Follow-up', subject: 'Following up on my application', preview: 'Dear [Hiring Manager], I recently applied for the [Position] position and wanted to follow up...', category: 'Follow-up' },
    { id: 3, title: 'Networking Introduction', subject: 'Introduction - [Your Name]', preview: 'Dear [Name], I came across your profile on LinkedIn and was impressed by your work...', category: 'Networking' },
    { id: 4, title: 'Thank You After Meeting', subject: 'Great meeting you today', preview: 'Dear [Name], It was a pleasure meeting you at [Event]. I enjoyed our conversation about...', category: 'Thank You' },
    { id: 5, title: 'Referral Request', subject: 'Seeking your guidance', preview: 'Dear [Name], I hope this message finds you well. I am reaching out because I am interested in...', category: 'Networking' },
    { id: 6, title: 'Offer Negotiation', subject: 'Regarding the offer for [Position]', preview: 'Dear [Hiring Manager], Thank you for extending the offer for the [Position] role. I am excited about...', category: 'Negotiation' },
];

export default function EmailTemplates() {
    const [templates] = useState(mockTemplates);

    return (
        <div className="email-templates-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Email Templates</h1>
                    <p className="page-subtitle">Pre-built templates for your job search communications</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Create Template
                </button>
            </div>

            <div className="templates-grid">
                {templates.map((template) => (
                    <div key={template.id} className="template-card">
                        <div className="template-header">
                            <div className="template-icon">
                                <Mail size={20} />
                            </div>
                            <span className="template-category">{template.category}</span>
                        </div>
                        <h3>{template.title}</h3>
                        <p className="template-subject">{template.subject}</p>
                        <p className="template-preview">{template.preview}</p>
                        <div className="template-actions">
                            <button className="action-btn"><Copy size={16} /> Copy</button>
                            <button className="action-btn"><Edit2 size={16} /> Edit</button>
                            <button className="action-btn delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
