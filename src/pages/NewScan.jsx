import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, X, CheckCircle } from 'lucide-react';
import { api } from '../api/client';
import './NewScan.css';

export default function NewScan() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileText, setFileText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Read file content as text
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            try {
                const text = await readFileAsText(selectedFile);
                setFileText(text);
            } catch (err) {
                console.error('Error reading file:', err);
                setError('Could not read file content');
            }
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            try {
                const text = await readFileAsText(droppedFile);
                setFileText(text);
            } catch (err) {
                console.error('Error reading file:', err);
                setError('Could not read file content');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = () => {
        setFile(null);
        setFileText('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            // Call the backend API to create a scan
            const response = await api.post('/scans', {
                resumeText: fileText,
                jobDescription: jobDescription,
                jobTitle: jobTitle || 'Untitled Position',
                company: company || ''
            });

            if (response.success && response.data) {
                // Navigate to results page with the scan data
                navigate('/scan/results', {
                    state: {
                        scanData: response.data,
                        resumeText: fileText,
                        jobDescription: jobDescription
                    }
                });
            } else {
                setError(response.error || 'Failed to analyze resume');
                setIsAnalyzing(false);
            }
        } catch (err) {
            console.error('Scan error:', err);
            setError(err.message || 'An error occurred during analysis');
            setIsAnalyzing(false);
        }
    };

    // Require both file and job description
    const isFormValid = fileText.length > 0 && jobDescription.trim().length > 0;

    return (
        <div className="new-scan-page">
            <div className="page-header">
                <h1 className="page-title">ATS Resume Scanner</h1>
                <p className="page-subtitle">Upload your CV and paste the job description to get AI-powered matching analysis</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="scan-cards-grid">
                {/* LEFT CARD: Your CV */}
                <div className="scan-card cv-card">
                    <div className="card-header">
                        <h2>Your CV</h2>
                    </div>

                    <div className="card-content">
                        {!file ? (
                            <div
                                className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt"
                                    onChange={handleFileSelect}
                                    hidden
                                />
                                <div className="upload-icon-circle">
                                    <Upload size={24} />
                                </div>
                                <p className="upload-primary">Drag & drop your resume</p>
                                <p className="upload-secondary">or browse files</p>
                                <p className="upload-helper">Supports PDF, DOCX, TXT (Max 10MB)</p>
                            </div>
                        ) : (
                            <div className="file-uploaded">
                                <div className="file-info">
                                    <div className="file-icon">
                                        <FileText size={24} />
                                    </div>
                                    <div className="file-details">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <button className="remove-file-btn" onClick={removeFile}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="file-status">
                                    <CheckCircle size={16} />
                                    <span>Ready for analysis ({fileText.length} characters)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CARD: Job Details */}
                <div className="scan-card job-card">
                    <div className="card-header">
                        <h2>Job Details</h2>
                    </div>

                    <div className="card-content">
                        <div className="form-group">
                            <label className="form-label">
                                Job Title <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Senior Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Google"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Job Description <span className="required">*</span>
                            </label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Paste the full job description here..."
                                rows={8}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analyze Button */}
            <div className="analyze-section">
                <button
                    className="btn btn-primary btn-lg analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!isFormValid || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <span className="spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Analyze Match
                        </>
                    )}
                </button>
                {!isFormValid && (
                    <p className="analyze-hint">
                        {!fileText ? 'Upload a resume to start' : 'Paste a job description to start analysis'}
                    </p>
                )}
            </div>
        </div>
    );
}
