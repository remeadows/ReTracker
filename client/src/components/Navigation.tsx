import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Navigation.css'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  // Don't show navigation on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>ReTracker v1</h1>
          <p>Personal Finance Tracker</p>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            📊 Expenses
          </Link>
          <Link
            to="/budget"
            className={`nav-link ${location.pathname === '/budget' ? 'active' : ''}`}
          >
            💰 Budget
          </Link>
        </div>
        {isAuthenticated && (
          <div className="nav-user">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
