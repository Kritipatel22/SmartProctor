import { useState, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ExamList from './pages/ExamList'
import ExamTaking from './pages/ExamTaking'
import PracticeQuiz from './pages/PracticeQuiz'
import Results from './pages/Results'
import Proctoring from './pages/Proctoring'
import ExamManagement from './pages/ExamManagement'

export const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

function Layout({ children, pageTitle }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                <Topbar title={pageTitle} />
                <div className="page-content">{children}</div>
            </div>
        </div>
    )
}

function App() {
    const [user, setUser] = useState(null)

    const login = (userData) => setUser(userData)
    const logout = () => setUser(null)

    if (!user) {
        return (
            <AuthContext.Provider value={{ user, login, logout }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        )
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
                    <Route path="/dashboard" element={<Layout pageTitle="Dashboard"><StudentDashboard /></Layout>} />
                    <Route path="/admin" element={<Layout pageTitle="Admin Dashboard"><AdminDashboard /></Layout>} />
                    <Route path="/exams" element={<Layout pageTitle="Examinations"><ExamList /></Layout>} />
                    <Route path="/exam/:examId" element={<Layout pageTitle="Exam"><ExamTaking /></Layout>} />
                    <Route path="/practice" element={<Layout pageTitle="Practice Quizzes"><PracticeQuiz /></Layout>} />
                    <Route path="/results" element={<Layout pageTitle="Results & Analytics"><Results /></Layout>} />
                    <Route path="/proctoring" element={<Layout pageTitle="AI Proctoring"><Proctoring /></Layout>} />
                    <Route path="/manage" element={<Layout pageTitle="Exam Management"><ExamManagement /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
