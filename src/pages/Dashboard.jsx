import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { useNavigate, Navigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { 
    character, level, setLevel, xp, tasks, addTask, completeTask, abandonTask, 
    mood, setMood, isBossPending, setIsBossPending, 
    activeBattle, setActiveBattle, streak, firstTaskDone, enemiesDefeated, notification
  } = useContext(GameContext);
  
  const [newTaskName, setNewTaskName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [isStriking, setIsStriking] = useState(false); // Controls the lunge
  const [isDefeated, setIsDefeated] = useState(false); // Controls absorption
  const [showGlow, setShowGlow] = useState(false); 

  if (!character) return <Navigate to="/" />;

  const beastImages = {
    easy: { active: 'beast-easy.png', defeated: 'beasteasy-defeated.png' },
    medium: { active: 'beast-medium.png', defeated: 'beastmedium-defeated.png' },
    hard: { active: 'beast-hard.png', defeated: 'beasthard-defeated.png' } 
  };

  // Determines the background and suffix for the flat image
  let currentBg = '/assets/bg-sitting.jpg';
  let currentStance = 'stance-cave';
  let imageSuffix = 'cave';
  
  if (activeBattle) {
    currentBg = '/assets/bg-walking.jpg'; 
    currentStance = 'stance-forest';
    imageSuffix = 'forest';
  } else if (tasks.length > 0) {
    currentBg = '/assets/bg-flying.jpg'; 
    currentStance = 'stance-sky';
    imageSuffix = 'sky';
  } 

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTaskName) {
      addTask({ id: Date.now(), name: newTaskName, difficulty });
      setNewTaskName('');
    }
  };

  const handleStrike = () => {
    // 1. Trigger the forward lunge animation
    setIsStriking(true);

    // 2. Wait for the strike to land (400ms), then slide back
    setTimeout(() => {
      setIsStriking(false); 
      setIsDefeated(true);  
      
      // 3. Begin the 4-second Qi Absorption phase
      setTimeout(() => {
        if (activeBattle.difficulty === 'hard' && isBossPending) {
          setLevel("Foundation Establishment"); 
          setIsBossPending(false);
          setShowGlow(true); 
          setTimeout(() => setShowGlow(false), 2500);
        }
        completeTask(activeBattle.id, activeBattle.difficulty);
        setIsDefeated(false);
      }, 4000); 

    }, 400); 
  };

  return (
    <div className="layout-grid" style={{ position: 'relative' }}>
      
      {notification && (
        <div className="badge-notification">
          <img src={`/assets/${notification.img}.png`} style={{ width: '35px', height: '35px', objectFit: 'contain' }} alt="badge" />
          <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>{notification.text}</span>
        </div>
      )}

      {/* --- LEFT: Task Manager --- */}
      <div className="glass-panel">
        <h2 style={{ borderBottom: '1px solid var(--line-light)' }}>Demon Bounties</h2>
        <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
          <input 
            value={newTaskName} onChange={e => setNewTaskName(e.target.value)} 
            placeholder="New Quest..." style={{ width: '100%', marginBottom: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '8px', border: '1px solid var(--line-light)' }}
          />
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="btn-gothic" style={{ width: '100%', marginBottom: '10px' }}>
            <option value="easy">Lesser Beast</option>
            <option value="medium">Shadow Wolf</option>
          </select>
          <button type="submit" className="btn-gothic" style={{ width: '100%', background: 'var(--accent-red)', color: 'white' }}>Add Bounty</button>
        </form>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onBattle={(t) => setActiveBattle(t)} 
              onFlee={abandonTask} 
            />
          ))}
        </div>
      </div>

      {/* --- CENTER: Dynamic Arena Stage --- */}
      <div className="glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
        
        {/* Battle Mode Indicator - Locked to flaming sword (sword.png) */}
        {activeBattle && (
          <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139,0,0,0.3)', padding: '5px 10px', borderRadius: '5px', border: '1px solid var(--accent-red)' }}>
            <span style={{ color: 'var(--accent-orange)', fontSize: '0.8rem', fontWeight: 'bold' }}>BATTLE MODE</span>
            <img src="/assets/sword.png" alt="battle active" style={{ width: '30px', height: '30px', objectFit: 'contain', transform: 'rotate(45deg)' }} />
          </div>
        )}

        <h2 style={{ margin: '0 0 5px 0' }}>{character.name}</h2>
        <p style={{ color: 'var(--accent-orange)', margin: '0 0 20px 0' }}>Realm: {level} | XP: {xp}</p>
        
        {isBossPending && !activeBattle ? (
          <div style={{ padding: '40px', border: '2px dashed var(--accent-red)', margin: '50px 0', background: 'rgba(139,0,0,0.2)' }}>
            <h2 style={{ color: 'var(--accent-orange)' }}>Breakthrough Tribulation Imminent!</h2>
            <button onClick={() => setActiveBattle({ id: 'boss', difficulty: 'hard' })} className="btn-gothic" style={{ background: 'var(--accent-red)', color: 'white', fontSize: '1.2rem', padding: '15px' }}>
              Engage Demon Boss
            </button>
          </div>
        ) : (
          <div className={`character-stage ${showGlow ? 'glow-yellow' : ''}`} style={{ backgroundImage: `url('${currentBg}')` }}>
            
            {/* The single rig that lunges when isStriking is true */}
            <div className={`character-rig ${currentStance} ${isStriking ? 'is-striking' : ''}`}>
              {/* MAGIC TRICK: Loads 'character-female-cave.png', etc. dynamically! */}
              <img src={`/assets/${character.classId}-${imageSuffix}.png`} alt="cultivator" />
            </div>

            {activeBattle && (
              <img 
                src={`/assets/${isDefeated ? beastImages[activeBattle.difficulty].defeated : beastImages[activeBattle.difficulty].active}`} 
                alt="Beast" 
                style={{ position: 'absolute', right: '5%', bottom: '15%', width: '220px', objectFit: 'contain', transition: '0.5s', zIndex: 10 }} 
              />
            )}
          </div>
        )}

        <div style={{ marginTop: '20px', minHeight: '60px' }}>
          {activeBattle && (
            <button onClick={handleStrike} className="btn-gothic" style={{ fontSize: '1.5rem', borderColor: 'var(--accent-red)', padding: '15px 30px' }} disabled={isDefeated || isStriking}>
              {isDefeated ? "ABSORBING QI..." : "ATTACK WITH WEAPON!"}
            </button>
          )}
        </div>
      </div>

      {/* --- RIGHT: Sect Stats & Mood --- */}
      <div className="glass-panel">
        <h2 style={{ borderBottom: '1px solid var(--line-light)' }}>Sect Stats</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
              <img src="/assets/flame.png" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} alt="flame" />
              <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-orange)' }}>{streak} Days</h3>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>Current Streak</span>
              </div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', opacity: enemiesDefeated > 0 ? 1 : 0.4 }}>
              <img src="/assets/crown.png" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} alt="crown" />
              <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{enemiesDefeated}</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--line-light)' }}>Demons Defeated</span>
              </div>
           </div>
        </div>

        <h2 style={{ borderBottom: '1px solid var(--line-light)', marginTop: '30px' }}>Current Mood</h2>
        <div style={{ textAlign: 'center', margin: '20px 0', minHeight: '80px' }}>
            <img src={`/assets/${mood}`} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,69,0,0.5))' }} alt="current mood" />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
           <button onClick={() => setMood('mood-happy.png')} className="btn-gothic">Happy</button>
           <button onClick={() => setMood('mood-neutral.png')} className="btn-gothic">Neutral</button>
           <button onClick={() => setMood('mood-sad.png')} className="btn-gothic">Sad</button>
           <button onClick={() => setMood('mood-angry.png')} className="btn-gothic">Angry</button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;