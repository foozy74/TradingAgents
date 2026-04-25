import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import DisclaimerPage from './Disclaimer.jsx'
import FrameworkPage from './Framework.jsx'
import './index.css'

console.log('Neural Patterns Dashboard: Initializing...');

const ErrorFallback = ({error}) => (
  <div style={{ backgroundColor: '#030712', color: '#f8fafc', height: '100vh', padding: '40px', fontFamily: 'monospace' }}>
    <h1 style={{ color: '#7dd3c0' }}>CRITICAL_SYSTEM_ERROR</h1>
    <pre style={{ color: '#ef4444', marginTop: '20px' }}>{error.message}</pre>
    <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', background: '#5b9bd5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>REBOOT_SYSTEM</button>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <ErrorFallback error={this.state.error} />;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/framework" element={<FrameworkPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
