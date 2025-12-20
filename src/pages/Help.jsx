import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, Book, ExternalLink } from 'lucide-react';
import './Help.css';

const faqs = [
    { id: 1, question: 'How does the ATS scan work?', answer: 'Our AI analyzes your resume against the job description, comparing keywords, skills, and formatting. It provides a match score and specific recommendations to improve your chances of passing ATS systems.' },
    { id: 2, question: 'What file formats are supported?', answer: 'We support PDF, DOC, and DOCX file formats for resume uploads. PDF is recommended for the best parsing accuracy.' },
    { id: 3, question: 'How accurate is the AI analysis?', answer: 'Our AI has been trained on millions of resumes and job descriptions, achieving over 95% accuracy in keyword matching and formatting analysis.' },
    { id: 4, question: 'Can I use this for multiple jobs?', answer: 'Yes! You can run unlimited scans with Pro plan. Each scan is tailored to the specific job description you provide.' },
    { id: 5, question: 'How do I cancel my subscription?', answer: 'You can cancel your subscription anytime from the Settings > Billing page. Your access will continue until the end of your billing period.' },
];

const resources = [
    { title: 'Getting Started Guide', description: 'Learn the basics of using Saanvi ResumeATS', icon: Book },
    { title: 'Resume Best Practices', description: 'Tips for creating ATS-friendly resumes', icon: Book },
    { title: 'Video Tutorials', description: 'Step-by-step video guides', icon: ExternalLink },
];

export default function Help() {
    const [expandedFaq, setExpandedFaq] = useState(null);

    return (
        <div className="help-page">
            <div className="page-header">
                <h1 className="page-title">Help & Support</h1>
                <p className="page-subtitle">Find answers to common questions or contact our support team</p>
            </div>

            <div className="help-layout">
                <div className="help-main">
                    <div className="section-card">
                        <h2><HelpCircle size={20} /> Frequently Asked Questions</h2>
                        <div className="faq-list">
                            {faqs.map((faq) => (
                                <div key={faq.id} className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                                    <button
                                        className="faq-question"
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    >
                                        <span>{faq.question}</span>
                                        {expandedFaq === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className="faq-answer">{faq.answer}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section-card">
                        <h2><Book size={20} /> Resources</h2>
                        <div className="resources-list">
                            {resources.map((resource, i) => (
                                <a key={i} href="#" className="resource-item">
                                    <resource.icon size={20} />
                                    <div>
                                        <h4>{resource.title}</h4>
                                        <p>{resource.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="help-sidebar">
                    <div className="contact-card">
                        <h3>Need more help?</h3>
                        <p>Our support team is here to assist you</p>
                        <button className="btn btn-primary">
                            <MessageCircle size={18} /> Start Chat
                        </button>
                        <button className="btn btn-secondary">
                            <Mail size={18} /> Email Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
