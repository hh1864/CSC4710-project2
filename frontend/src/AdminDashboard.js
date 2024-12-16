import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/'); // Redirect to the homepage
  };

  const buttonStyle = {
    textDecoration: 'none',
    fontSize: '1.2rem',
    color: '#007bff',
    padding: '10px 20px',
    border: '1px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const hoverStyle = {
    backgroundColor: '#007bff',
    color: '#ffffff',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#007bff' }}>Admin Dashboard</h2>
      <nav style={{ textAlign: 'center', marginBottom: '20px' }}>
        <ul style={{ listStyleType: 'none', padding: '0', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <li>
            <Link to="/" style={buttonStyle} onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/"
              style={buttonStyle}
              onClick={handleLogout}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ color: '#333' }}>Admin Functions</h3>
        <ul>
          <li>Manage Users</li>
          <li>Review System Logs</li>
          <li>Generate Reports</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
