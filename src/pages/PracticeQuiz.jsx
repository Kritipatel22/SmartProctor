import { useState } from 'react'
import { practiceQuizzes, practiceQuestions } from '../data/mockData'
import { Gamepad, Trophy, ThumbsUp, BookOpen, RefreshCw, Play, CheckCircle, XCircle, FileText, Calculator, Microscope, Scroll, Code, Globe } from '../components/Icons'

const quizIcons = { 101: <Calculator size={40} color="var(--accent-blue)" />, 102: <Microscope size={40} color="var(--accent-green)" />, 103: <Scroll size={40} color="var(--accent-orange)" />, 104: <Code size={40} color="var(--accent-red)" />, 105: <Globe size={40} color="var(--accent-purple)" />, 106: <BookOpen size={40} color="var(--accent-blue)" /> }

export default function PracticeQuiz() {
    const [activeQuiz, setActiveQuiz] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showFeedback, setShowFeedback] = useState(false)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)

    const startQuiz = (quiz) => { setActiveQuiz(quiz); setCurrentQ(0); setAnswers({}); setScore(0); setCompleted(false); setShowFeedback(false) }
    const quizQuestions = activeQuiz ? practiceQuestions.filter(q => q.quizId === activeQuiz.id) : []

    const handleAnswer = (optIdx) => {
        if (showFeedback) return
        const isCorrect = optIdx === quizQuestions[currentQ].correct
        setAnswers(prev => ({ ...prev, [currentQ]: optIdx }))
        if (isCorrect) setScore(s => s + 1)
        setShowFeedback(true)
        setTimeout(() => {
            setShowFeedback(false)
            if (currentQ < quizQuestions.length - 1) setCurrentQ(c => c + 1)
            else setCompleted(true)
        }, 1500)
    }

    if (completed) {
        const pct = Math.round((score / quizQuestions.length) * 100)
        return (
            <div className="animate-slide-up" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: 48 }}>
                    <div style={{ marginBottom: 16 }}>{pct >= 70 ? <Trophy size={64} color="var(--accent-orange)" /> : pct >= 40 ? <ThumbsUp size={64} color="var(--accent-green)" /> : <BookOpen size={64} color="var(--accent-blue)" />}</div>
                    <h1 style={{ marginBottom: 8 }}>Quiz Complete!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{activeQuiz.title}</p>
                    <div style={{ fontSize: 48, fontWeight: 800, color: pct >= 70 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{score}/{quizQuestions.length}</div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{pct}% correct</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => startQuiz(activeQuiz)}><RefreshCw size={16} /> Retry</button>
                        <button className="btn btn-secondary" onClick={() => { setActiveQuiz(null); setCompleted(false) }}><BookOpen size={16} /> All Quizzes</button>
                    </div>
                </div>
            </div>
        )
    }

    if (activeQuiz && quizQuestions.length > 0) {
        const q = quizQuestions[currentQ]
        return (
            <div className="animate-fade-in" style={{ maxWidth: 650, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h2>{activeQuiz.title}</h2>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Question {currentQ + 1} of {quizQuestions.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>Score: {score}</span>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setActiveQuiz(null); setCompleted(false) }}><XCircle size={14} /> Exit</button>
                    </div>
                </div>
                <div className="progress-bar" style={{ marginBottom: 24 }}>
                    <div className="fill blue" style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <div className="glass-card">
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 28, lineHeight: 1.6 }}>{q.text}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {q.options.map((opt, i) => {
                            let extraClass = ''
                            if (showFeedback && answers[currentQ] !== undefined) {
                                if (i === q.correct) extraClass = 'correct'
                                else if (i === answers[currentQ]) extraClass = 'incorrect'
                            }
                            return (
                                <button key={i} className={`option-btn ${answers[currentQ] === i && !showFeedback ? 'selected' : ''} ${extraClass}`} onClick={() => handleAnswer(i)}>
                                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                    <span>{opt}</span>
                                    {showFeedback && i === q.correct && <span style={{ marginLeft: 'auto' }}><CheckCircle size={16} color="var(--accent-green)" /></span>}
                                    {showFeedback && i === answers[currentQ] && i !== q.correct && <span style={{ marginLeft: 'auto' }}><XCircle size={16} color="var(--accent-red)" /></span>}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-slide-up">
            <div className="page-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Gamepad size={28} /> Practice Quizzes</h1>
                <p>Fun and interactive quizzes to improve your understanding</p>
            </div>
            <div className="grid-3">
                {practiceQuizzes.map((quiz, i) => (
                    <div key={quiz.id} className="glass-card" style={{ cursor: 'pointer', animationDelay: `${i * 0.05}s` }} onClick={() => startQuiz(quiz)}>
                        <div style={{ marginBottom: 16 }}>{quizIcons[quiz.id] || <FileText size={40} />}</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{quiz.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{quiz.subject}</p>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={12} /> {quiz.questions} Questions</span>
                            <span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}><Play size={14} /> Start Quiz</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
