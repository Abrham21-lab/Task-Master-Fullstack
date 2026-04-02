import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './Login';      // Make sure these filenames match exactly!
import Register from './Register'; 
import Dashboard from './Dashboard'; 

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <nav>
          <Link tpo="/login" style={{ margin: '10px' }}>Login</Link>
          <Link to="/register" style={{ margin: '10px' }}>Register</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;