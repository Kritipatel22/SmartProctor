import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { exams, questions as allQuestions } from '../data/mockData'
import { Clock, AlertTriangle, Video, ClipboardList, Flag, ArrowLeft, ArrowRight, CheckCircle, XCircle, BarChart, Inbox, FileText } from '../components/Icons'

export default function ExamTaking() {
    const { examId } = useParams()
    const navigate = useNavigate()
    const exam = exams.find(e => e.id === parseInt(examId)) || exams[0]
    const examQuestions = allQuestions.filter(q => q.examId === exam.id)
    const [shuffled] = useState(() => [...examQuestions].sort(() => Math.random() - 0.5))

    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [flagged, setFlagged] = useState(new Set())
    const [timeLeft, setTimeLeft] = useState(exam.duration * 60)
    const [submitted, setSubmitted] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [proctorWarning, setProctorWarning] = useState(null)
    const [warningCount, setWarningCount] = useState(0)
    const [webcamActive, setWebcamActive] = useState(true)

    useEffect(() => {
        if (submitted) return
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); handleAutoSubmit(); return 0 }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [submitted])

    useEffect(() => {
        if (submitted) return
        const warnings = [
            { type: 'no_face', msg: 'No Face Detected! Please Stay Visible.' },
            { type: 'multiple', msg: 'Multiple Faces Detected. Cheating Alert!' },
            { type: 'tab', msg: 'Tab Switch Detected! Stay on exam page.' },
        ]
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const w = warnings[Math.floor(Math.random() * warnings.length)]
                setProctorWarning(w)
                setWarningCount(c => c + 1)
                setTimeout(() => setProctorWarning(null), 4000)
            }
        }, 15000)
        return () => clearInterval(interval)
    }, [submitted])

    const handleAutoSubmit = useCallback(() => { setSubmitted(true); setShowResult(true) }, [])
    const submitExam = () => { setShowConfirm(false); setSubmitted(true); setShowResult(true) }
    const selectAnswer = (qIdx, optIdx) => { if (!submitted) setAnswers(prev => ({ ...prev, [qIdx]: optIdx })) }
    const toggleFlag = () => {
        setFlagged(prev => { const next = new Set(prev); next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ); return next })
    }
    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
    const calcScore = () => { let score = 0; shuffled.forEach((q, i) => { if (answers[i] === q.correct) score++ }); return score }
    const timerClass = timeLeft < 60 ? 'danger' : timeLeft < 300 ? 'warning' : ''

    if (showResult) {
        const score = calcScore(), total = shuffled.length, pct = Math.round((score / total) * 100), passed = pct >= 40
        return (
            <div className="animate-slide-up" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: 48 }}>
                    <div style={{ marginBottom: 16 }}>{passed ? <CheckCircle size={64} color="var(--accent-green)" /> : <XCircle size={64} color="var(--accent-red)" />}</div>
                    <h1 style={{ fontSize: 32, marginBottom: 8 }}>{passed ? 'Congratulations!' : 'Better Luck Next Time'}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{exam.title} - Results</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
                        <div><div style={{ fontSize: 36, fontWeight: 800, color: passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>{score}/{total}</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Score</div></div>
                        <div><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-blue)' }}>{pct}%</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Percentage</div></div>
                        <div><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-orange)' }}>{warningCount}</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Warnings</div></div>
                    </div>
                    <span className={`badge ${passed ? 'badge-passed' : 'badge-failed'}`} style={{ fontSize: 14, padding: '8px 24px' }}>{passed ? 'PASSED' : 'FAILED'}</span>
                    <div style={{ marginTop: 32 }}>
                        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Answer Review</h3>
                        {shuffled.map((q, i) => (
                            <div key={i} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-glass)' }}>
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Q{i + 1}: {q.text}</div>
                                <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: answers[i] === q.correct ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                    {answers[i] === q.correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    Your Answer: {answers[i] !== undefined ? q.options[answers[i]] : 'Not Attempted'}
                                    {answers[i] !== q.correct && <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>Correct: {q.options[q.correct]}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                        <button className="btn btn-primary" onClick={() => navigate('/exams')}><ClipboardList size={16} /> Back to Exams</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/results')}><BarChart size={16} /> View All Results</button>
                    </div>
                </div>
            </div>
        )
    }

    const q = shuffled[currentQ]
    if (!q) return <div className="empty-state"><Inbox size={48} /><h3>No questions found for this exam</h3><button className="btn btn-primary" onClick={() => navigate('/exams')}>Back to Exams</button></div>

    return (
        <div className="animate-fade-in">
            <div className="exam-header">
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>{exam.title}</h2>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{exam.subject}</span>
                </div>
                <div className={`exam-timer ${timerClass}`}>
                    <Clock size={18} /> Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            {proctorWarning && (
                <div className="alert-bar warning" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={16} /> {proctorWarning.msg}
                </div>
            )}

            <div className="exam-container">
                <div className="exam-main">
                    <div className="question-card">
                        <div className="q-number">Question {currentQ + 1} of {shuffled.length}</div>
                        <div className="q-text">{q.text}</div>
                        <div className="options">
                            {q.options.map((opt, i) => (
                                <button key={i} className={`option-btn ${answers[currentQ] === i ? 'selected' : ''}`} onClick={() => selectAnswer(currentQ, i)}>
                                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                    <span>{opt}</span>
                                </button>
                            ))}
                        </div>
                        <div className="question-nav">
                            <button className="btn btn-secondary btn-sm" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}><ArrowLeft size={14} /> Previous</button>
                            <button className={`btn btn-sm ${flagged.has(currentQ) ? 'btn-danger' : 'btn-secondary'}`} onClick={toggleFlag}>
                                <Flag size={14} /> {flagged.has(currentQ) ? 'Flagged' : 'Flag'}
                            </button>
                            {currentQ < shuffled.length - 1 ? (
                                <button className="btn btn-primary btn-sm" onClick={() => setCurrentQ(c => c + 1)}>Next <ArrowRight size={14} /></button>
                            ) : (
                                <button className="btn btn-success btn-sm" onClick={() => setShowConfirm(true)}><CheckCircle size={14} /> Submit Exam</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="exam-sidebar-panel">
                    <div className="webcam-preview">
                        <div className="cam-box"><Video size={48} color="var(--text-muted)" /></div>
                        <div className={`cam-status ${webcamActive ? 'active' : 'warning'}`}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: webcamActive ? 'var(--accent-green)' : 'var(--accent-red)', display: 'inline-block' }}></span>
                            {webcamActive ? 'Face Detected' : 'No Face'}
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={14} /> Question Navigator</div>
                        <div className="q-nav-grid">
                            {shuffled.map((_, i) => (
                                <button key={i} className={`q-nav-btn ${i === currentQ ? 'current' : ''} ${answers[i] !== undefined ? 'answered' : ''} ${flagged.has(i) ? 'flagged' : ''}`} onClick={() => setCurrentQ(i)}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            <span>Answered: {Object.keys(answers).length}</span>
                            <span>Remaining: {shuffled.length - Object.keys(answers).length}</span>
                            <span>Flagged: {flagged.size}</span>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> Warnings: {warningCount}</div>
                        <div className="progress-bar"><div className={`fill ${warningCount > 3 ? 'red' : warningCount > 1 ? 'orange' : 'green'}`} style={{ width: `${Math.min(warningCount * 20, 100)}%` }} /></div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Max 5 warnings allowed</div>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={20} /> Submit Exam?</h2>
                        <p>You have answered {Object.keys(answers).length} out of {shuffled.length} questions. {shuffled.length - Object.keys(answers).length > 0 ? `${shuffled.length - Object.keys(answers).length} questions are unanswered.` : 'All questions answered!'}</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="btn btn-success" onClick={submitExam}><CheckCircle size={16} /> Confirm Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
