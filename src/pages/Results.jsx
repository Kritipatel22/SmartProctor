import { useState } from 'react'
import { results, activityLogs } from '../data/mockData'
import { BarChart, ClipboardList, FileText, TrendingUp, AlertTriangle, CheckCircle, Users, Ban, Armchair, RefreshCw } from '../components/Icons'

const alertIcons = { multiple_faces: <Users size={14} />, no_face: <Ban size={14} />, left_seat: <Armchair size={14} />, tab_switch: <RefreshCw size={14} /> }

export default function Results() {
    const [tab, setTab] = useState('results')
    const barData = [65, 78, 85, 60, 92, 70, 88, 55, 76, 82, 90, 68]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><BarChart size={28} /> Results & Analytics</h1>
                <p>View exam performance and activity logs</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button className={`btn btn-sm ${tab === 'results' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('results')}><ClipboardList size={14} /> Results</button>
                <button className={`btn btn-sm ${tab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('analytics')}><BarChart size={14} /> Analytics</button>
                <button className={`btn btn-sm ${tab === 'logs' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('logs')}><FileText size={14} /> Activity Logs</button>
            </div>

            {tab === 'results' && (
                <div className="glass-card">
                    <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={16} /> All Results</span></div>
                    <table className="data-table">
                        <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>Percentage</th><th>Status</th><th>Warnings</th><th>Date</th></tr></thead>
                        <tbody>
                            {results.map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                                    <td>{r.examTitle}</td>
                                    <td>{r.score}/{r.total}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className="progress-bar" style={{ width: 80 }}><div className={`fill ${r.percentage >= 70 ? 'green' : r.percentage >= 40 ? 'orange' : 'red'}`} style={{ width: `${r.percentage}%` }} /></div>
                                            <span style={{ fontSize: 13 }}>{r.percentage}%</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                                    <td>{r.warnings > 0 ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-red)' }}><AlertTriangle size={14} /> {r.warnings}</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-green)' }}><CheckCircle size={14} /> 0</span>}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'analytics' && (
                <div className="grid-2">
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
                        <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={16} /> Score Distribution</span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                            {['90-100%', '70-89%', '40-69%', '0-39%'].map((range, i) => {
                                const widths = [20, 45, 25, 10], colors = ['green', 'blue', 'orange', 'red']
                                return (
                                    <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 12, width: 70, color: 'var(--text-muted)' }}>{range}</span>
                                        <div className="progress-bar" style={{ flex: 1 }}><div className={`fill ${colors[i]}`} style={{ width: `${widths[i]}%` }} /></div>
                                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 30 }}>{widths[i]}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'logs' && (
                <div className="glass-card">
                    <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> Suspicious Activity Logs</span></div>
                    <table className="data-table">
                        <thead><tr><th>Student</th><th>Activity</th><th>Exam</th><th>Severity</th><th>Time</th></tr></thead>
                        <tbody>
                            {activityLogs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontWeight: 600 }}>{log.studentName}</td>
                                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{alertIcons[log.type] || <AlertTriangle size={14} />} {log.message}</span></td>
                                    <td>{log.examTitle}</td>
                                    <td><span className={`badge badge-${log.severity === 'high' ? 'failed' : log.severity === 'medium' ? 'medium' : 'easy'}`}>{log.severity}</span></td>
                                    <td style={{ color: 'var(--text-muted)' }}>{log.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
