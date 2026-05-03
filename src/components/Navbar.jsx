import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // NEW: Reads the current URL
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // NEW: A helper function that returns active/inactive styles
  const getNavStyle = (path) => ({
    textDecoration: 'none',
    background: location.pathname === path ? 'var(--accent-red)' : 'rgba(0,0,0,0.6)',
    color: location.pathname === path ? 'white' : 'var(--accent-orange)',
    borderColor: location.pathname === path ? 'var(--accent-red)' : 'var(--line-light)'
  });

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '15px 20px', marginBottom: '20px', borderRadius: '0 0 10px 10px',
      borderTop: 'none', position: 'relative', zIndex: 1000
    }}>
      <h2 style={{ margin: 0, color: 'var(--accent-red)', letterSpacing: '2px', fontSize: '1.2rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>ASCENSION LOG</Link>
      </h2>
      
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* DESKTOP MENU - Using the dynamic style helper */}
      <div className="desktop-menu">
        <Link to="/dashboard" className="btn-gothic" style={getNavStyle('/dashboard')}>Sect Mission Board</Link>
        <Link to="/profile" className="btn-gothic" style={getNavStyle('/profile')}>Scroll of Dao</Link>
        <Link to="/realms" className="btn-gothic" style={getNavStyle('/realms')}>Heavenly Realms</Link>
        
        <button onClick={() => navigate('/')} className="btn-gothic" style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)' }}>
          Leave Sect
        </button>
      </div>

      {/* MOBILE MENU - Using the dynamic style helper */}
      {isOpen && (
        <div className="mobile-menu-dropdown glass-panel">
          <Link to="/dashboard" onClick={closeMenu} className="btn-gothic" style={getNavStyle('/dashboard')}>Sect Mission Board</Link>
          <Link to="/profile" onClick={closeMenu} className="btn-gothic" style={getNavStyle('/profile')}>Scroll of Dao</Link>
          <Link to="/realms" onClick={closeMenu} className="btn-gothic" style={getNavStyle('/realms')}>Heavenly Realms</Link>
          
          <button onClick={() => { closeMenu(); navigate('/'); }} className="btn-gothic" style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)', marginTop: '10px' }}>
            Leave Sect
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;