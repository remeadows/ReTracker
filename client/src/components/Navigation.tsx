import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>ReTracker</h1>
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
      </div>
    </nav>
  )
}

export default Navigation
