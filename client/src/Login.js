import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 👈 ADDED 'Link' HERE

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token || "true");
        navigate('/admin'); 
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Server error. Is the backend running?');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', background: '#fffafb' 
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white', padding: '40px', borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center',
        width: '100%', maxWidth: '400px'
      }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#d4a373', marginBottom: '10px' }}>
          Tata's Touch
        </h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>Admin Portal Access</p>
        
        {error && (
          <p style={{ 
            color: '#721c24', background: '#f8d7da', padding: '10px', 
            borderRadius: '8px', fontSize: '14px', border: '1px solid #f5c6cb' 
          }}>
            {error}
          </p>
        )}

        <input 
          type="password" 
          placeholder="Enter Admin Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px', margin: '20px 0',
            borderRadius: '10px', border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />

        <button 
          type="submit" 
          style={{ 
            width: '100%', background: '#d4a373', color: 'white', 
            padding: '12px', border: 'none', borderRadius: '10px', 
            fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#c29262'}
          onMouseOut={(e) => e.target.style.background = '#d4a373'}
        >
          Login to Dashboard
        </button>

        {/* 👈 FORGOT PASSWORD LINK ADDED HERE */}
        <Link 
          to="/forgot-password" 
          style={{ 
            display: 'block', 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#888', 
            textDecoration: 'none' 
          }}
          onMouseOver={(e) => e.target.style.color = '#d4a373'}
          onMouseOut={(e) => e.target.style.color = '#888'}
        >
          Forgot Password?
        </Link>
     
      </form>
    </div>
  );
};

export default Login;