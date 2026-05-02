import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // NEW: State to track if the mobile hamburger menu is open
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close the menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '15px 20px', marginBottom: '20px', borderRadius: '0 0 10px 10px',
      borderTop: 'none', position: 'relative', zIndex: 1000
    }}>
      <h2 style={{ margin: 0, color: 'var(--accent-red)', letterSpacing: '2px', fontSize: '1.2rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>ASCENSION LOG</Link>
      </h2>
      
      {/* MOBILE ONLY: The Hamburger Icon */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* DESKTOP ONLY: The Standard Horizontal Menu */}
      <div className="desktop-menu">
        <Link to="/dashboard" className="btn-gothic" style={{ textDecoration: 'none' }}>Sect Mission Board</Link>
        <Link to="/profile" className="btn-gothic" style={{ textDecoration: 'none' }}>Scroll of Dao</Link>
        <Link to="/realms" className="btn-gothic" style={{ textDecoration: 'none' }}>Heavenly Realms</Link>
        
        <button 
          onClick={() => navigate('/')} 
          className="btn-gothic" 
          style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)' }}
        >
          Leave Sect
        </button>
      </div>

      {/* MOBILE ONLY: The Dropdown Overlay (Shows only when isOpen is true) */}
      {isOpen && (
        <div className="mobile-menu-dropdown glass-panel">
          <Link to="/dashboard" onClick={closeMenu} className="btn-gothic" style={{ textDecoration: 'none' }}>Sect Mission Board</Link>
          <Link to="/profile" onClick={closeMenu} className="btn-gothic" style={{ textDecoration: 'none' }}>Scroll of Dao</Link>
          <Link to="/realms" onClick={closeMenu} className="btn-gothic" style={{ textDecoration: 'none' }}>Heavenly Realms</Link>
          
          <button 
            onClick={() => { closeMenu(); navigate('/'); }} 
            className="btn-gothic" 
            style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)', marginTop: '10px' }}
          >
            Leave Sect
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;