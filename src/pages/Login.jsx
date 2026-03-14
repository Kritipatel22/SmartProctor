import { useState } from 'react'
import { useAuth } from '../App'
import { users } from '../data/mockData'
import { Lock, Rocket } from '../components/Icons'

export default function Login() {
    const { login } = useAuth()
    const [mode, setMode] = useState('login')
    const [role, setRole] = useState('student')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (mode === 'login') {
            if (role === 'admin') {
                login({ id: 1, name: 'Admin User', email: 'admin@smartproctor.com', role: 'admin', avatar: 'A' })
            } else {
                const student = users.find(u => u.role === 'student')
                login(student || { id: 2, name: 'Student User', email, role: 'student', avatar: 'S' })
            }
        } else {
            login({ id: Date.now(), name: name || 'New User', email, role, avatar: (name || 'U').charAt(0) })
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-area">
                    <div className="logo-circle">S</div>
                    <h1>SmartProctor</h1>
                    <p>AI-Enabled Secure Examination System</p>
                </div>
                <div className="role-toggle">
                    <button className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>Student</button>
                    <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input className="form-input" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input className="form-input" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-input" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <div className="alert-bar warning"><AlertTriangle size={14} /> {error}</div>}
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                        {mode === 'login' ? <><Lock size={16} /> Sign In</> : <><Rocket size={16} /> Create Account</>}
                    </button>
                </form>
                <div className="switch-mode">
                    {mode === 'login' ? (
                        <>Don't have an account? <a onClick={() => setMode('register')}>Register</a></>
                    ) : (
                        <>Already have an account? <a onClick={() => setMode('login')}>Sign In</a></>
                    )}
                </div>
            </div>
        </div>
    )
}
