import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { useNavigate, Navigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { 
    character, level, setLevel, xp, tasks, addTask, completeTask, abandonTask, 
    mood, setMood, pendingTribulation, setPendingTribulation, 
    activeBattle, setActiveBattle, streak, enemiesDefeated, notification,
    hasSeenBossWarning, setHasSeenBossWarning,
    insights, setInsights,
    customMinutes, setCustomMinutes, timeLeft, setTimeLeft, timerActive, setTimerActive
  } = useContext(GameContext);
  
  const [newTaskName, setNewTaskName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [isStriking, setIsStriking] = useState(false); 
  const [isDefeated, setIsDefeated] = useState(false); 
  const [showYellowGlow, setShowYellowGlow] = useState(false); 

  const [moodAdvice, setMoodAdvice] = useState("Your Qi is settled. Begin your cultivation.");
  const [streakPulse, setStreakPulse] = useState(false);

  useEffect(() => {
    if (streak > 0) {
      setStreakPulse(true);
      const timer = setTimeout(() => setStreakPulse(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const [reflection, setReflection] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showAscensionFlash, setShowAscensionFlash] = useState(false);
  const [showRealmPopup, setShowRealmPopup] = useState(false);

  if (!character) return <Navigate to="/" />;

  const beastConfig = {
    easy: { active: 'beast-easy.png', defeated: 'beasteasy-defeated.png', width: '200px', bottom: '15%', right: '5%' },
    medium: { active: 'beast-medium.png', defeated: 'beastmedium-defeated.png', width: '300px', bottom: '7%', right: '-1%' },
    hard: { active: 'beast-hard.png', defeated: 'beasthard-defeated.png', width: '400px', bottom: '5%', right: '-4%' } 
  };

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTaskName) {
      addTask({ id: Date.now(), name: newTaskName, difficulty });
      if (difficulty === 'hard') {
        setHasSeenBossWarning(true);
      }
      setNewTaskName('');
    }
  };

  const startBattle = (task) => {
    if (activeBattle && activeBattle.id !== task.id) {
      setActiveBattle(null); 
      setTimeout(() => {
        setActiveBattle(task);
        if (task.difficulty === 'hard') {
          setTimeLeft(customMinutes * 60); 
          setTimerActive(false);
        }
      }, 800); 
    } else {
      setActiveBattle(task);
      if (task.difficulty === 'hard' && !timerActive && timeLeft === customMinutes * 60) {
        setTimeLeft(customMinutes * 60); 
        setTimerActive(false);
      }
    }
  };

  const handleStrike = () => {
    setIsStriking(true);
    setTimeout(() => {
      setIsStriking(false); 
      setIsDefeated(true);  
      setShowYellowGlow(true); 
      setTimeout(() => {
        completeTask(activeBattle.id, activeBattle.difficulty);
        setIsDefeated(false);
        setShowYellowGlow(false);
        setTimeLeft(customMinutes * 60); 
      }, 4000); 
    }, 400); 
  };

  const handleMoodSelect = (moodImg) => {
    setMood(moodImg);
    if (moodImg.includes('happy')) setMoodAdvice("Your Qi flows smoothly. Ride this momentum to conquer great heights!");
    else if (moodImg.includes('neutral')) setMoodAdvice("A calm mind is a cultivator's greatest weapon. Stay grounded.");
    else if (moodImg.includes('sad')) setMoodAdvice("Even bright stars are born in dark voids. Rest if you must, but do not yield.");
    else if (moodImg.includes('angry')) setMoodAdvice("Channel this fiery energy into your strikes! Let frustration fuel your breakthrough.");
  };

  const handleReflectionSubmit = async () => {
    if (reflection.split(' ').length < 10) {
      return alert("Your Dao is shallow. Provide at least 10 words of true reflection.");
    }
    setIsEvaluating(true);
    
    setTimeout(() => {
      setIsEvaluating(false);

      // Save the insight
      const newInsight = {
        id: Date.now(),
        realm: pendingTribulation,
        text: reflection,
        date: new Date().toLocaleDateString()
      };
      setInsights(prev => [newInsight, ...prev]);

      // Trigger the flash, which hides the tribulation box naturally
      setShowAscensionFlash(true); 
      
      setTimeout(() => {
        // BUG FIX: Update the level AND clear the tribulation simultaneously!
        // This prevents GameContext from accidentally triggering it again during the delay.
        setLevel(pendingTribulation); 
        setPendingTribulation(null); 
        
        setShowRealmPopup(true); 
        
        setTimeout(() => {
          setShowAscensionFlash(false);
          setShowRealmPopup(false);
          setReflection('');
        }, 4000);
        
      }, 1500); 
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="layout-grid" style={{ position: 'relative' }}>
        
        {showAscensionFlash && <div className="ascension-screen-flash"></div>}
        
        {showRealmPopup && (
          <div className="realm-popup">
            <h3 style={{ color: '#fff', margin: '0 0 10px 0', letterSpacing: '2px' }}>Breakthrough Successful!</h3>
            <h1>{level}</h1>
          </div>
        )}

        {pendingTribulation && !showAscensionFlash && !showRealmPopup && (
          <div className="tribulation-overlay">
            <div className="tribulation-box">
              <h2 style={{ color: 'gold', fontSize: '2.5rem', margin: 0 }}>Heavenly Tribulation</h2>
              <p style={{ color: '#ccc', fontSize: '1.2rem' }}>You stand at the threshold of <strong>{pendingTribulation}</strong>. To break through, prove your mind is tempered.</p>
              <p style={{ color: 'var(--accent-orange)' }}>Reflect on your recent tasks: What was your greatest bottleneck, and how did you overcome it?</p>
              <textarea 
                className="dao-textarea" 
                placeholder="The path to immortality requires insight. Type your reflection here..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                disabled={isEvaluating}
              />
              <button 
                className="btn-gothic" 
                style={{ background: 'gold', color: 'black', fontSize: '1.2rem', padding: '15px 30px', marginTop: '20px', width: '100%' }}
                onClick={handleReflectionSubmit}
                disabled={isEvaluating}
              >
                {isEvaluating ? "The Heavens are Judging..." : "Submit to the Heavens"}
              </button>
            </div>
          </div>
        )}

        {notification && (
          <div className="badge-notification">
            <img src={`/assets/${notification.img}.png`} style={{ width: '35px', height: '35px', objectFit: 'contain' }} alt="badge" />
            <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>{notification.text}</span>
          </div>
        )}

        {/* --- LEFT: Task Manager --- */}
        <div className="glass-panel">
          
          <h2 style={{ 
            borderBottom: '1px solid var(--line-light)',
            color: !activeBattle ? 'var(--accent-orange)' : 'var(--text-main)',
            textShadow: !activeBattle ? '0 0 10px rgba(255, 69, 0, 0.4)' : 'none',
            transition: 'all 0.3s ease',
            paddingBottom: '5px'
          }}>
            Demon Bounties {!activeBattle && <span style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--line-light)', float: 'right', marginTop: '5px'}}>Awaiting Target...</span>}
          </h2>

          <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
            <input 
              value={newTaskName} onChange={e => setNewTaskName(e.target.value)} 
              placeholder="New Quest..." style={{ width: '100%', marginBottom: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '8px', border: '1px solid var(--line-light)' }}
            />
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="btn-gothic" style={{ width: '100%', marginBottom: '10px' }}>
              <option value="easy">Gale Wolf [Minor Demon]</option>
              <option value="medium">Netherflame Beast [Elite Fiend]</option>
              <option value="hard">Abyssal Demon King [Boss Battle]</option>
            </select>

            {difficulty === 'hard' && !hasSeenBossWarning && (
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', marginBottom: '15px', fontStyle: 'italic', borderLeft: '2px solid var(--accent-orange)', paddingLeft: '8px' }}>
                * Defeating a Demon King requires real-world focus. You must complete a minimum 20-minute Pomodoro task to gather enough Qi to strike!
              </div>
            )}

            <button type="submit" className="btn-gothic" style={{ width: '100%', background: 'var(--accent-red)', color: 'white' }}>Add Bounty</button>
          </form>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isActive={activeBattle && activeBattle.id === task.id} 
                onBattle={() => startBattle(task)} 
                onFlee={abandonTask} 
              />
            ))}
          </div>
        </div>

        {/* --- CENTER: Dynamic Arena Stage --- */}
        <div className="glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
          
          {activeBattle && (
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139,0,0,0.3)', padding: '5px 10px', borderRadius: '5px', border: '1px solid var(--accent-red)' }}>
              <span style={{ color: 'var(--accent-orange)', fontSize: '0.8rem', fontWeight: 'bold' }}>BATTLE MODE</span>
              <img src="/assets/sword.png" alt="battle active" style={{ width: '30px', height: '30px', objectFit: 'contain', transform: 'rotate(45deg)' }} />
            </div>
          )}

          <h2 style={{ margin: '0 0 5px 0' }}>{character.name}</h2>
          <p style={{ color: 'var(--accent-orange)', margin: '0 0 20px 0' }}>Realm: {level} | XP: {xp}</p>
          
          <div className={`character-stage ${showYellowGlow ? 'glow-yellow' : ''}`} style={{ backgroundImage: `url('${currentBg}')` }}>
            
            <div className={`character-rig ${currentStance} ${isStriking ? 'is-striking' : ''}`}>
              <img src={`/assets/${character.classId}-${imageSuffix}.png`} alt="cultivator" />
            </div>

            {activeBattle && (
              <img 
                key={activeBattle.id} 
                className="beast-spawn"
                src={`/assets/${isDefeated ? beastConfig[activeBattle.difficulty].defeated : beastConfig[activeBattle.difficulty].active}`} 
                alt="Beast" 
                style={{ 
                  position: 'absolute', 
                  right: beastConfig[activeBattle.difficulty].right, 
                  bottom: beastConfig[activeBattle.difficulty].bottom, 
                  width: beastConfig[activeBattle.difficulty].width, 
                  objectFit: 'contain', 
                  zIndex: 10 
                }} 
              />
            )}
          </div>

          <div style={{ marginTop: '20px', minHeight: '80px' }}>
            {activeBattle && activeBattle.difficulty === 'hard' && !isDefeated ? (
              <div>
                {/* BUG FIX: Checks if the timer actually ran, or if it's just empty/0 in setup mode! */}
                {timeLeft > 0 || timeLeft === (customMinutes || 0) * 60 ? (
                  <>
                    {!timerActive && timeLeft === (customMinutes || 0) * 60 ? (
                        <>
                          <p style={{ color: 'var(--line-light)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '15px', padding: '0 20px' }}>
                            Set your meditation timer. Focus purely on your real-world task to gather Qi. Do not break your concentration until the timer ends!
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <input 
                              type="number" 
                              className="timer-input"
                              min="20" 
                              value={customMinutes} 
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                setCustomMinutes(val);
                                setTimeLeft((val || 0) * 60);
                              }} 
                            />
                            <span style={{ fontSize: '1.5rem', color: 'var(--accent-orange)', fontWeight: 'bold' }}>MINUTES</span>
                          </div>
                        </>
                    ) : (
                        <div className="pomodoro-display">{formatTime(timeLeft)}</div>
                    )}

                    {!timerActive ? (
                      <button 
                        onClick={() => {
                          if (!customMinutes || customMinutes < 20) {
                            setCustomMinutes(20);
                            setTimeLeft(20 * 60);
                            alert("The Heavens demand at least 20 minutes of focus to temper your Dao!");
                            return; 
                          }
                          setTimerActive(true);
                        }} 
                        className="btn-gothic" 
                        style={{ background: 'var(--accent-red)' }}
                      >
                        PREPARE FOR BATTLE
                      </button>
                    ) : (
                      <button onClick={() => setTimerActive(false)} className="btn-gothic">BREATHE</button>
                    )}
                  </>
                ) : (
                  <button onClick={handleStrike} className="btn-gothic" style={{ fontSize: '1.5rem', borderColor: 'var(--accent-red)', padding: '15px 30px' }} disabled={isStriking}>
                      DELIVER FINAL STRIKE!
                  </button>
                )}
              </div>
            ) : activeBattle ? (
              <button onClick={handleStrike} className="btn-gothic" style={{ fontSize: '1.5rem', borderColor: 'var(--accent-red)', padding: '15px 30px' }} disabled={isDefeated || isStriking}>
                {isDefeated ? "ABSORBING QI..." : "ATTACK WITH WEAPON!"}
              </button>
            ) : null}
          </div>
        </div>

        {/* --- RIGHT: Sect Stats & Mood --- */}
        <div className="glass-panel">
          <h2 style={{ borderBottom: '1px solid var(--line-light)' }}>Sect Stats</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
                <img src="/assets/flame.png" className={`sect-flame ${streakPulse ? 'is-pulsing' : ''}`} alt="flame" />
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
            <button onClick={() => handleMoodSelect('mood-happy.png')} className="btn-gothic">Happy</button>
            <button onClick={() => handleMoodSelect('mood-neutral.png')} className="btn-gothic">Neutral</button>
            <button onClick={() => handleMoodSelect('mood-sad.png')} className="btn-gothic">Sad</button>
            <button onClick={() => handleMoodSelect('mood-angry.png')} className="btn-gothic">Angry</button>
          </div>

          <div className="mood-advice">
            {moodAdvice}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;