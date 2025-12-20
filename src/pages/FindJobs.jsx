import { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, Star, ExternalLink, Filter } from 'lucide-react';
import './FindJobs.css';

const mockJobs = [
    { id: 1, title: 'Senior Frontend Developer', company: 'Google', location: 'Mountain View, CA', salary: '$180k-$220k', type: 'Full-time', posted: '2 days ago', match: 92 },
    { id: 2, title: 'React Developer', company: 'Meta', location: 'Menlo Park, CA', salary: '$160k-$200k', type: 'Full-time', posted: '3 days ago', match: 88 },
    { id: 3, title: 'UI Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$190k-$250k', type: 'Full-time', posted: '1 week ago', match: 85 },
    { id: 4, title: 'Frontend Engineer', company: 'Apple', location: 'Cupertino, CA', salary: '$170k-$210k', type: 'Full-time', posted: '4 days ago', match: 82 },
    { id: 5, title: 'Software Engineer', company: 'Microsoft', location: 'Remote', salary: '$150k-$190k', type: 'Remote', posted: '1 day ago', match: 79 },
    { id: 6, title: 'Full Stack Developer', company: 'Amazon', location: 'Seattle, WA', salary: '$145k-$185k', type: 'Full-time', posted: '5 days ago', match: 75 },
];

export default function FindJobs() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="find-jobs-page">
            <div className="page-header">
                <h1 className="page-title">Find Jobs</h1>
                <p className="page-subtitle">Discover jobs that match your profile</p>
            </div>

            <div className="search-section">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="jobs-list">
                {mockJobs.map((job) => (
                    <div key={job.id} className="job-listing">
                        <div className="job-logo">{job.company.charAt(0)}</div>
                        <div className="job-content">
                            <div className="job-header">
                                <h3>{job.title}</h3>
                                <div className="match-badge">{job.match}% Match</div>
                            </div>
                            <p className="job-company">{job.company}</p>
                            <div className="job-meta">
                                <span><MapPin size={14} /> {job.location}</span>
                                <span><Briefcase size={14} /> {job.type}</span>
                                <span className="salary">{job.salary}</span>
                                <span><Clock size={14} /> {job.posted}</span>
                            </div>
                        </div>
                        <div className="job-actions">
                            <button className="save-btn"><Star size={18} /></button>
                            <button className="btn btn-primary btn-sm">Apply</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
