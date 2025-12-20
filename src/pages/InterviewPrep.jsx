import { useState } from 'react';
import { MessageSquare, Lightbulb, Play, ChevronDown, ChevronUp, Star } from 'lucide-react';
import './InterviewPrep.css';

const categories = [
    { id: 'behavioral', name: 'Behavioral', icon: '💬' },
    { id: 'technical', name: 'Technical', icon: '💻' },
    { id: 'situational', name: 'Situational', icon: '🎯' },
    { id: 'company', name: 'Company Specific', icon: '🏢' },
];

const questions = [
    { id: 1, category: 'behavioral', question: 'Tell me about yourself', difficulty: 'Easy', tip: 'Keep it professional and relevant to the role. Focus on your career journey.' },
    { id: 2, category: 'behavioral', question: 'Why do you want to work here?', difficulty: 'Medium', tip: 'Research the company and show genuine interest in their mission.' },
    { id: 3, category: 'technical', question: 'Explain the virtual DOM in React', difficulty: 'Medium', tip: 'Describe how React uses a lightweight copy to optimize rendering.' },
    { id: 4, category: 'technical', question: 'What is the difference between let, const, and var?', difficulty: 'Easy', tip: 'Explain scoping, hoisting, and reassignment differences.' },
    { id: 5, category: 'situational', question: 'How would you handle a tight deadline?', difficulty: 'Medium', tip: 'Show prioritization skills and communication with stakeholders.' },
    { id: 6, category: 'situational', question: 'Describe a time you failed and what you learned', difficulty: 'Hard', tip: 'Be honest, show growth mindset and specific learnings.' },
];

export default function InterviewPrep() {
    const [selectedCategory, setSelectedCategory] = useState('behavioral');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const filteredQuestions = questions.filter(q => q.category === selectedCategory);

    return (
        <div className="interview-prep-page">
            <div className="page-header">
                <h1 className="page-title">Interview Preparation</h1>
                <p className="page-subtitle">Practice common interview questions with AI-powered tips</p>
            </div>

            <div className="category-tabs">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="questions-list">
                {filteredQuestions.map((q) => (
                    <div key={q.id} className={`question-card ${expandedQuestion === q.id ? 'expanded' : ''}`}>
                        <div
                            className="question-header"
                            onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                        >
                            <div className="question-info">
                                <h4>{q.question}</h4>
                                <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                            </div>
                            {expandedQuestion === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedQuestion === q.id && (
                            <div className="question-content">
                                <div className="tip-box">
                                    <Lightbulb size={18} />
                                    <div>
                                        <strong>Tip:</strong>
                                        <p>{q.tip}</p>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-sm">
                                    <Play size={16} /> Practice Answer
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
