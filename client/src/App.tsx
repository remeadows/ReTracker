import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import BudgetDashboard from './components/BudgetDashboard'
import Navigation from './components/Navigation'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<BudgetDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
