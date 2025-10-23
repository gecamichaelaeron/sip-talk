import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<{ fullname: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user session
    const checkSession = () => {
      const session = localStorage.getItem('user_session');
      if (session) {
        try {
          const userData = JSON.parse(session);
          setUser({ fullname: userData.fullname });
        } catch (error) {
          console.error('Error loading session:', error);
        }
      } else {
        setUser(null);
      }
    };

    checkSession();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkSession);
    
    // Custom event for same-tab updates
    const handleAuthChange = () => checkSession();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    // Trigger custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    // Programmatic navigation to home after logout
    navigate('/');
  };

  return (
    <div className="navbar-background">
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>
          Menu
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
          Contact
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => isActive ? 'active' : ''}>
          Feedback
        </NavLink>
        <NavLink to="/reservation" className={({ isActive }) => isActive ? 'active' : ''}>
          Reservation
        </NavLink>
        {user ? (
          <>
            <span style={{ color: '#c7c1bb' }}>Welcome, {user.fullname}</span>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </a>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
            Login
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

