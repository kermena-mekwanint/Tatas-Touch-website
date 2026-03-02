import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [username] = useState('admin'); 
  const [question, setQuestion] = useState('Loading question...');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch the question when the page loads
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/get-question/${username}`)
      .then(res => res.json())
      .then(data => setQuestion(data.question))
      .catch(() => setQuestion("Could not load security question"));
  }, [username]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, securityAnswer: answer, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password changed successfully! ✨");
        navigate('/login');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Connection error. Is the server running?");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fffafb' }}>
      <form onSubmit={handleReset} style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' }}>
        <h2 style={{ color: '#d4a373', fontFamily: 'serif' }}>Account Recovery</h2>
        <p style={{ fontSize: '12px', color: '#888' }}>Username: <b>{username}</b></p>
        
        <div style={{ background: '#fdf2f5', padding: '15px', borderRadius: '10px', margin: '20px 0', border: '1px solid #f8d7da' }}>
          <p style={{ fontSize: '11px', color: '#e91e63', margin: '0 0 5px 0', fontWeight: 'bold' }}>SECURITY QUESTION:</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{question}</p>
        </div>

        {message && <p style={{ color: 'red', fontSize: '12px' }}>{message}</p>}

        <input type="text" placeholder="Your Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }} />

        <button type="submit" style={{ width: '100%', background: '#d4a373', color: 'white', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          Reset Password
        </button>
        
        <Link to="/login" style={{ display: 'block', marginTop: '20px', fontSize: '12px', color: '#d4a373', textDecoration: 'none' }}>Back to Login</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;