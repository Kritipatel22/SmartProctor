import { Link } from 'react-router-dom'
import { dashboardStats, results, activityLogs } from '../data/mockData'
import { CheckCircle, AlertTriangle, ClipboardList, Users, BarChart } from '../components/Icons'

export default function AdminDashboard() {
    const barData = [65, 78, 85, 60, 92, 70, 88, 55, 76, 82, 90, 68]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1>Results & Analytics</h1>
                <p>Overview of exam performance and system activity</p>
            </div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={22} color="var(--accent-green)" /></div>
                    <div className="stat-info"><h3>{dashboardStats.avgScore}%</h3><p>Avg Score</p></div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon"><AlertTriangle size={22} color="var(--accent-red)" /></div>
                    <div className="stat-info"><h3>{dashboardStats.alertsToday + 2}</h3><p>Alerts</p></div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon"><ClipboardList size={22} color="var(--accent-blue)" /></div>
                    <div className="stat-info"><h3>{dashboardStats.examsConducted}</h3><p>Exams Conducted</p></div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Users size={22} color="var(--accent-purple)" /></div>
                    <div className="stat-info"><h3>{dashboardStats.totalStudents}</h3><p>Students</p></div>
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 28 }}>
                <div className="glass-card">
                    <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BarChart size={16} /> Performance Chart</span></div>
                    <div className="chart-bars">
                        {barData.map((h, i) => (
                            <div key={i} className="chart-bar" style={{ height: `${h}%` }}>
                                <span className="chart-label">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card">
                    <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} color="var(--accent-red)" /> Suspicious Activity Log</span></div>
                    {activityLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: log.severity === 'high' ? 'var(--accent-red)' : log.severity === 'medium' ? 'var(--accent-orange)' : 'var(--accent-blue)' }}></span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{log.message}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.studentName}</div>
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card">
                <div className="section-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={16} /> Recent Results</span>
                    <Link to="/results" style={{ fontSize: 13, color: 'var(--accent-blue)', textDecoration: 'none' }}>View All →</Link>
                </div>
                <table className="data-table">
                    <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>Status</th><th>Warnings</th><th>Date</th></tr></thead>
                    <tbody>
                        {results.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                                <td>{r.examTitle}</td>
                                <td>{r.score}/{r.total} ({r.percentage}%)</td>
                                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                                <td>{r.warnings > 0 ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-red)' }}><AlertTriangle size={14} /> {r.warnings}</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-green)' }}><CheckCircle size={14} /> 0</span>}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
