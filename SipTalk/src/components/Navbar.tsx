import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<{ fullname: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    // Trigger custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    // Programmatic navigation to home after logout
    navigate('/');
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Prevent body scroll when menu is open on mobile
    if (newState && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="navbar-background">
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/" onClick={closeMobileMenu}>Sip & Talk</NavLink>
        </div>
        
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            Menu
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/feedback" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            Feedback
          </NavLink>
          <NavLink 
            to="/reservation" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            Reservation
          </NavLink>
          {user ? (
            <>
              <span className="user-welcome">Welcome, {user.fullname}</span>
              <a onClick={handleLogout} className="nav-link-btn">
                Logout
              </a>
            </>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

