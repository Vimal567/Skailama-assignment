import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);

  const handle = (role) => {
    setRole(role);
    navigate('/events/' + role);
  };

  return (
    <div className="container center">
      <h1>Event Management</h1>
      <p>Choose a role</p>
      <div className="btn-row">
        <button className="btn primary" onClick={() => handle('admin')}>Admin Login</button>
        <button className="btn" onClick={() => handle('user')}>User Login</button>
      </div>
    </div>
  );
}
