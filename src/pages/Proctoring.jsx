import { activityLogs } from '../data/mockData'
import { Bot, Camera, AlertTriangle, Users, Ban, Armchair, Brain, Bell, ClipboardList, ShieldCheck, Eye } from '../components/Icons'

export default function Proctoring() {
    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Bot size={28} /> AI Proctoring</h1>
                <p>Real-Time Exam Monitoring</p>
            </div>

            <div className="grid-2" style={{ marginBottom: 28 }}>
                <div className="glass-card">
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Live Monitoring Preview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[
                            { icon: <Eye size={40} color="var(--accent-green)" />, label: 'Face Detected', status: 'active', statusText: 'Face Detected', statusIcon: <Eye size={12} /> },
                            { icon: <Ban size={40} color="var(--accent-red)" />, label: 'No Face', status: 'warning', statusText: 'No Face Detected', statusIcon: <Ban size={12} /> },
                            { icon: <Users size={40} color="var(--accent-orange)" />, label: 'Multiple Faces', status: 'warning', statusText: 'Multiple Faces Detected', statusIcon: <Users size={12} /> },
                            { icon: <Armchair size={40} color="var(--accent-red)" />, label: 'Left Seat', status: 'warning', statusText: 'Suspicious Activity!', statusIcon: <AlertTriangle size={12} /> },
                        ].map((cam, i) => (
                            <div key={i} style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: 12, textAlign: 'center' }}>
                                <div style={{ width: '100%', aspectRatio: '4/3', background: '#1a1a2e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' }}>
                                    {cam.icon}
                                    <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: cam.status === 'warning' ? 'rgba(239,68,68,0.9)' : 'rgba(16,185,129,0.9)', borderRadius: 4, padding: '4px 8px', fontSize: 10, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                        {cam.statusIcon} {cam.statusText}
                                    </div>
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cam.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card">
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Features</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { icon: <Camera size={22} color="var(--accent-blue)" />, title: 'Real-Time Face Detection', desc: 'Continuous webcam monitoring using OpenCV' },
                            { icon: <AlertTriangle size={22} color="var(--accent-red)" />, title: 'Suspicious Activity Alerts', desc: 'Instant warnings for policy violations' },
                            { icon: <Brain size={22} color="var(--accent-purple)" />, title: 'Behavior Analysis', desc: 'AI-powered pattern recognition' },
                            { icon: <Bell size={22} color="var(--accent-orange)" />, title: 'Automated Warnings', desc: 'Real-time student notifications' },
                            { icon: <ClipboardList size={22} color="var(--accent-green)" />, title: 'Activity Logging', desc: 'Complete audit trail of all events' },
                            { icon: <ShieldCheck size={22} color="var(--accent-blue)" />, title: 'Exam Integrity', desc: 'Prevent and detect cheating attempts' },
                        ].map((feat, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>{feat.icon}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{feat.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{feat.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <div className="section-title"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} color="var(--accent-red)" /> Recent Alert History</span></div>
                <table className="data-table">
                    <thead><tr><th>Student</th><th>Alert Type</th><th>Exam</th><th>Severity</th><th>Time</th><th>Action</th></tr></thead>
                    <tbody>
                        {activityLogs.map(log => (
                            <tr key={log.id}>
                                <td style={{ fontWeight: 600 }}>{log.studentName}</td>
                                <td>{log.message}</td>
                                <td>{log.examTitle}</td>
                                <td><span className={`badge ${log.severity === 'high' ? 'badge-failed' : 'badge-medium'}`}>{log.severity}</span></td>
                                <td style={{ color: 'var(--text-muted)' }}>{log.time}</td>
                                <td><button className="btn btn-secondary btn-sm"><Eye size={14} /> Review</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
