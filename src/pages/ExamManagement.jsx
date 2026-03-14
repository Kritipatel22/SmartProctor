import { useState } from 'react'
import { exams as initialExams } from '../data/mockData'
import { Settings, Plus, Edit, Trash, Save } from '../components/Icons'

export default function ExamManagement() {
    const [examList, setExamList] = useState([...initialExams])
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ title: '', subject: '', questions: 20, duration: 30, status: 'upcoming', totalMarks: 20, passingMarks: 8 })

    const resetForm = () => { setForm({ title: '', subject: '', questions: 20, duration: 30, status: 'upcoming', totalMarks: 20, passingMarks: 8 }); setEditId(null) }

    const handleSave = (e) => {
        e.preventDefault()
        if (editId) {
            setExamList(prev => prev.map(ex => ex.id === editId ? { ...ex, ...form } : ex))
        } else {
            setExamList(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().split('T')[0] }])
        }
        setShowForm(false); resetForm()
    }

    const handleEdit = (exam) => {
        setForm({ title: exam.title, subject: exam.subject, questions: exam.questions, duration: exam.duration, status: exam.status, totalMarks: exam.totalMarks, passingMarks: exam.passingMarks })
        setEditId(exam.id); setShowForm(true)
    }

    const handleDelete = (id) => setExamList(prev => prev.filter(e => e.id !== id))

    const toggleStatus = (id) => {
        setExamList(prev => prev.map(e => {
            if (e.id !== id) return e
            const next = e.status === 'upcoming' ? 'live' : e.status === 'live' ? 'completed' : 'upcoming'
            return { ...e, status: next }
        }))
    }

    return (
        <div className="animate-slide-up">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Settings size={28} /> Exam Management</h1>
                    <p>Create, edit, and manage examinations</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true) }}><Plus size={16} /> Create Exam</button>
            </div>

            <div className="glass-card">
                <table className="data-table">
                    <thead><tr><th>Exam</th><th>Subject</th><th>Questions</th><th>Duration</th><th>Marks</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {examList.map(exam => (
                            <tr key={exam.id}>
                                <td style={{ fontWeight: 600 }}>{exam.title}</td>
                                <td>{exam.subject}</td>
                                <td>{exam.questions}</td>
                                <td>{exam.duration} min</td>
                                <td>{exam.totalMarks} (Pass: {exam.passingMarks})</td>
                                <td>
                                    <span className={`badge badge-${exam.status}`} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(exam.id)}>
                                        {exam.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(exam)}><Edit size={14} /></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(exam.id)}><Trash size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: 550 }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{editId ? <><Edit size={20} /> Edit Exam</> : <><Plus size={20} /> Create New Exam</>}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Exam Title</label>
                                    <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input className="form-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Number of Questions</label>
                                    <input className="form-input" type="number" value={form.questions} onChange={e => setForm(p => ({ ...p, questions: parseInt(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label>Duration (minutes)</label>
                                    <input className="form-input" type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Total Marks</label>
                                    <input className="form-input" type="number" value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: parseInt(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label>Passing Marks</label>
                                    <input className="form-input" type="number" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: parseInt(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm() }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editId ? <><Save size={16} /> Save Changes</> : <><Plus size={16} /> Create Exam</>}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
