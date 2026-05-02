import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Realms = () => {
  const { character, level } = useContext(GameContext);

  if (!character) return <Navigate to="/" />;

  const cultivationPath = [
    { name: "Qi Condensation", req: "0 XP", desc: "Gathering the breath of the world into your body." },
    { name: "Foundation Establishment", req: "500 XP", desc: "Solidifying your inner core to prepare for true power." },
    { name: "Core Formation", req: "1500 XP", desc: "Condensing your Qi into an unbreakable golden core." },
    { name: "Nascent Soul", req: "3500 XP", desc: "Birthing a spirit identical to yourself; achieving minor immortality." },
    { name: "Soul Transformation", req: "7000 XP", desc: "Merging the physical and spiritual into one absolute force." },
    { name: "Void Refinement", req: "15000 XP", desc: "Shattering the space around you with mere thought." }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
      <Navbar />
      
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent-orange)', marginBottom: '30px' }}>The Nine Heavens Progression</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cultivationPath.map((realm, index) => {
            const isCurrent = level === realm.name;
            return (
              <div key={index} style={{ 
                background: isCurrent ? 'rgba(139,0,0,0.4)' : 'rgba(0,0,0,0.5)',
                border: isCurrent ? '2px solid gold' : '1px solid var(--line-light)',
                padding: '20px', borderRadius: '8px',
                transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                transition: '0.3s'
              }}>
                <h2 style={{ margin: '0 0 5px 0', color: isCurrent ? 'gold' : 'white' }}>
                  {realm.name} {isCurrent && " (Current Realm)"}
                </h2>
                <span style={{ color: 'var(--accent-orange)', fontSize: '0.9rem', fontWeight: 'bold' }}>Requirement: {realm.req}</span>
                <p style={{ color: 'var(--line-light)', fontStyle: 'italic', margin: '10px 0 0 0' }}>{realm.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Realms;