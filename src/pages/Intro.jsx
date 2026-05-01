import React from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'var(--accent-red)', fontSize: '2.5rem', marginBottom: '10px' }}>Ascension Log</h1>
      <h3 style={{ color: 'var(--accent-orange)' }}>A Gamified Productivity Tracker</h3>
      <p style={{ lineHeight: '1.6', margin: '30px 0' }}>
        Welcome, wanderer. Turn your daily tasks into epic cultivation quests. 
        Slay demons (tasks) to earn XP, maintain your streaks, and break through to higher realms of productivity.
      </p>
      <button onClick={() => navigate('/creator')} className="btn-gothic" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
        Step Into The Sect
      </button>
    </div>
  );
};

export default Intro;