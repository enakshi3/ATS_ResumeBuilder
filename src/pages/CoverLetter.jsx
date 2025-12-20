import { useState } from 'react';
import { FileText, Wand2, Copy, Download, Sparkles } from 'lucide-react';
import './CoverLetter.css';

export default function CoverLetter() {
    const [jobDescription, setJobDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    const handleGenerate = () => {
        if (jobDescription.trim()) {
            setIsGenerating(true);
            setTimeout(() => {
                setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With over 5 years of experience in frontend development and a proven track record of building scalable web applications, I am confident that I would be a valuable addition to your team.

In my current role at Tech Corp, I have successfully led the development of a React-based dashboard that improved user engagement by 40%. I have expertise in React, TypeScript, and modern web technologies that align perfectly with your requirements.

I am particularly excited about this opportunity because of your company's commitment to innovation and user-centric design. I believe my skills in creating intuitive user interfaces and my passion for clean, maintainable code would contribute significantly to your projects.

I would welcome the opportunity to discuss how my experience and skills can benefit your team. Thank you for considering my application.

Best regards,
John Doe`);
                setIsGenerating(false);
            }, 2000);
        }
    };

    return (
        <div className="cover-letter-page">
            <div className="page-header">
                <h1 className="page-title">AI Cover Letter Generator</h1>
                <p className="page-subtitle">Create personalized cover letters tailored to each job</p>
            </div>

            <div className="cover-letter-layout">
                <div className="input-section">
                    <label className="label">Job Description</label>
                    <textarea
                        className="input textarea"
                        placeholder="Paste the job description here..."
                        rows={12}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleGenerate}
                        disabled={!jobDescription.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <>Generating...</>
                        ) : (
                            <>
                                <Wand2 size={18} />
                                Generate Cover Letter
                            </>
                        )}
                    </button>
                </div>

                <div className="output-section">
                    <div className="output-header">
                        <h3><FileText size={18} /> Generated Cover Letter</h3>
                        {coverLetter && (
                            <div className="output-actions">
                                <button className="btn btn-ghost btn-sm"><Copy size={16} /> Copy</button>
                                <button className="btn btn-ghost btn-sm"><Download size={16} /> Download</button>
                            </div>
                        )}
                    </div>
                    <div className="output-content">
                        {coverLetter ? (
                            <div className="cover-letter-text">{coverLetter}</div>
                        ) : (
                            <div className="empty-state">
                                <Sparkles size={48} />
                                <p>Your AI-generated cover letter will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
