import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CharacterProfile = () => {
  // NEW: Bringing in totalFocusMinutes from Context
  const { character, level, xp, streak, enemiesDefeated, insights, totalFocusMinutes } = useContext(GameContext);

  if (!character) return <Navigate to="/" />;

  // NEW: Math to convert total raw minutes into clean Hours and Minutes
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;
  
  // Format the text elegantly depending on whether they've reached a full hour yet
  const formattedTime = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 15px' }}>
      <Navbar />
      
      <div className="glass-panel" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Stats Column */}
        <div className="profile-stats-col" style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
          <img 
            src={`/assets/${character.classId}-cave.png`} 
            alt="avatar" 
            style={{ width: '200px', filter: 'drop-shadow(0 0 20px rgba(255,69,0,0.4))' }} 
          />
          <h1 style={{ color: 'var(--accent-orange)', margin: '10px 0' }}>{character.name}</h1>
          <h3 style={{ color: 'white', margin: '0 0 20px 0' }}>Realm: {level}</h3>
          
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: '1px solid var(--accent-red)' }}>
            <p style={{ margin: '5px 0' }}><strong>Current XP:</strong> {xp}</p>
            <p style={{ margin: '5px 0' }}><strong>Demons Slain:</strong> {enemiesDefeated}</p>
            <p style={{ margin: '5px 0' }}><strong>Unbroken Resolve:</strong> {streak} {streak === 1 ? 'Day' : 'Days'}</p>
            
            {/* NEW: Displays their total productive time! */}
            <p style={{ margin: '10px 0 5px 0', borderTop: '1px dashed var(--line-light)', paddingTop: '10px', color: 'var(--accent-orange)' }}>
              <strong>Focused Cultivation:</strong>
              <br/>{formattedTime}
            </p>
          </div>
        </div>

        {/* Right Insights Column */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ color: 'var(--accent-red)', borderBottom: '1px solid var(--accent-red)', paddingBottom: '10px', marginTop: 0 }}>
            Scroll of Personal Dao (Insights)
          </h2>
          
          {insights.length === 0 ? (
            <p style={{ color: 'var(--line-light)', fontStyle: 'italic' }}>Your scroll is empty. Break through a Heavenly Tribulation to record your first insight.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              {insights.map((insight) => (
                <div key={insight.id} style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid gold' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: 'var(--accent-orange)' }}>
                    <span>Breakthrough: <strong>{insight.realm}</strong></span>
                    <span>{insight.date}</span>
                  </div>
                  <p style={{ fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>"{insight.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CharacterProfile;