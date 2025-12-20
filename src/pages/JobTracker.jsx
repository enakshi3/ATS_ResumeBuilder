import { useState } from 'react';
import { Plus, Star, MapPin, DollarSign, Calendar, ExternalLink, MoreHorizontal } from 'lucide-react';
import './JobTracker.css';

const initialJobs = {
    saved: [
        { id: 1, company: 'Google', role: 'Senior Frontend Developer', location: 'Mountain View, CA', salary: '$180k-$220k', starred: true },
        { id: 2, company: 'Meta', role: 'React Developer', location: 'Menlo Park, CA', salary: '$160k-$200k', starred: false },
    ],
    applied: [
        { id: 3, company: 'Netflix', role: 'UI Engineer', location: 'Los Gatos, CA', salary: '$190k-$250k', appliedDate: '2024-01-15', starred: true },
        { id: 4, company: 'Apple', role: 'Frontend Engineer', location: 'Cupertino, CA', salary: '$170k-$210k', appliedDate: '2024-01-12', starred: false },
    ],
    interviewing: [
        { id: 5, company: 'Microsoft', role: 'Senior SWE', location: 'Redmond, WA', salary: '$175k-$215k', appliedDate: '2024-01-08', starred: true },
    ],
    offer: [
        { id: 6, company: 'Stripe', role: 'Frontend Developer', location: 'San Francisco, CA', salary: '$185k-$225k', starred: true },
    ],
    rejected: [
        { id: 7, company: 'Amazon', role: 'SDE II', location: 'Seattle, WA', salary: '$150k-$180k', starred: false },
    ]
};

const columns = [
    { id: 'saved', title: 'Saved', color: 'neutral' },
    { id: 'applied', title: 'Applied', color: 'primary' },
    { id: 'interviewing', title: 'Interviewing', color: 'accent' },
    { id: 'offer', title: 'Offer', color: 'success' },
    { id: 'rejected', title: 'Rejected', color: 'error' },
];

export default function JobTracker() {
    const [jobs] = useState(initialJobs);

    const totalJobs = Object.values(jobs).flat().length;
    const activeJobs = jobs.interviewing.length + jobs.offer.length;

    return (
        <div className="job-tracker-page">
            <div className="tracker-header">
                <div className="header-info">
                    <h1 className="page-title">Job Tracker</h1>
                    <div className="header-stats">
                        <span className="total-badge">{totalJobs} total</span>
                        <span className="active-badge">{activeJobs} active</span>
                    </div>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Add Job
                </button>
            </div>

            <div className="kanban-board">
                {columns.map((column) => (
                    <div key={column.id} className={`kanban-column column-${column.color}`}>
                        <div className="column-header">
                            <h3>{column.title}</h3>
                            <span className="column-count">{jobs[column.id].length}</span>
                        </div>
                        <div className="column-content">
                            {jobs[column.id].map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="job-card-header">
                                        <div className="company-logo">{job.company.charAt(0)}</div>
                                        <div className="job-info">
                                            <h4>{job.role}</h4>
                                            <span className="company-name">{job.company}</span>
                                        </div>
                                        <button className={`star-btn ${job.starred ? 'active' : ''}`}>
                                            <Star size={16} />
                                        </button>
                                    </div>
                                    <div className="job-details">
                                        <span><MapPin size={14} /> {job.location}</span>
                                        <span><DollarSign size={14} /> {job.salary}</span>
                                    </div>
                                    {job.appliedDate && (
                                        <div className="job-footer">
                                            <span className="applied-date">
                                                <Calendar size={12} /> Applied {job.appliedDate}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {jobs[column.id].length === 0 && (
                                <div className="empty-column">
                                    <p>No jobs here</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
