import { Link } from 'react-router-dom'
import { dashboardStats, exams, activityLogs } from '../data/mockData'
import { ClipboardList, Users, AlertTriangle, Target, Rocket, Bot, FileText, Ban, Armchair, RefreshCw } from '../components/Icons'

export default function StudentDashboard() {
    const liveExams = exams.filter(e => e.status === 'live')
    const alertIcons = { multiple_faces: <Users size={16} />, no_face: <Ban size={16} />, left_seat: <Armchair size={16} />, tab_switch: <RefreshCw size={16} /> }

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1>Welcome to SmartProctor!</h1>
                <p>AI-Enabled Secure Examination System</p>
            </div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
                <div className="stat-card blue">
                    <div className="stat-icon"><ClipboardList size={22} color="var(--accent-blue)" /></div>
                    <div className="stat-info">
                        <h3>{dashboardStats.activeExams}</h3>
                        <p>Active Exams</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Users size={22} color="var(--accent-green)" /></div>
                    <div className="stat-info">
                        <h3>{dashboardStats.studentsOnline}</h3>
                        <p>Students Online</p>
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon"><AlertTriangle size={22} color="var(--accent-red)" /></div>
                    <div className="stat-info">
                        <h3>{dashboardStats.alertsToday}</h3>
                        <p>Alerts Today</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Target size={22} color="var(--accent-orange)" /></div>
                    <div className="stat-info">
                        <h3>{dashboardStats.aiAccuracy}%</h3>
                        <p>AI Accuracy</p>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                <Link to="/exams" className="btn btn-primary btn-lg"><Rocket size={18} /> Start Exam</Link>
                <Link to="/proctoring" className="btn btn-secondary btn-lg"><Bot size={18} /> View AI Monitoring</Link>
            </div>
            <div className="grid-2">
                <div className="glass-card">
                    <div className="section-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Recent Exams</span>
                        <Link to="/exams" style={{ fontSize: 13, color: 'var(--accent-blue)', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    {liveExams.map(exam => (
                        <div key={exam.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{exam.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exam.questions} Q • {exam.duration} min</div>
                            </div>
                            <span className="badge badge-live">LIVE</span>
                        </div>
                    ))}
                </div>
                <div className="glass-card">
                    <div className="section-title">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} color="var(--accent-red)" /> Suspicious Alerts</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Today</span>
                    </div>
                    {activityLogs.slice(0, 4).map(log => (
                        <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--accent-red)' }}>{alertIcons[log.type] || <AlertTriangle size={16} />}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{log.message}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.studentName}</div>
                                </div>
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
