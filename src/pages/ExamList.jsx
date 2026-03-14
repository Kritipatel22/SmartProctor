import { useState } from 'react'
import { Link } from 'react-router-dom'
import { exams } from '../data/mockData'
import { Search, FileText, Rocket, Lock, BarChart, Calendar, Clock } from '../components/Icons'

export default function ExamList() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = exams.filter(e => {
        if (filter !== 'all' && e.status !== filter) return false
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={28} /> Examinations</h1>
                <p>Browse and start available exams</p>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="topbar-search" style={{ minWidth: 280 }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input type="text" placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {['all', 'live', 'upcoming', 'completed'].map(f => (
                    <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
            <div className="grid-3">
                {filtered.map((exam, i) => (
                    <div key={exam.id} className="glass-card" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{exam.title}</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{exam.subject}</p>
                            </div>
                            <span className={`badge badge-${exam.status}`}>{exam.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={14} /> {exam.questions} Questions</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {exam.duration} min</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                            <span>Total: {exam.totalMarks} marks</span>
                            <span>Pass: {exam.passingMarks} marks</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <div className="progress-bar" style={{ flex: 1 }}>
                                <div className={`fill ${exam.status === 'completed' ? 'green' : 'blue'}`} style={{ width: exam.status === 'completed' ? '100%' : exam.status === 'live' ? '60%' : '0%' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {exam.date}</div>
                        {exam.status === 'live' ? (
                            <Link to={`/exam/${exam.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}><Rocket size={16} /> Start Exam</Link>
                        ) : exam.status === 'upcoming' ? (
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled><Lock size={16} /> Not Available Yet</button>
                        ) : (
                            <Link to="/results" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}><BarChart size={16} /> View Results</Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
