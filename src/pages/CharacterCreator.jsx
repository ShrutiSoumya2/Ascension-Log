import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const CharacterCreator = () => {
  const { character, setCharacter, resetProgressForNewUser } = useContext(GameContext);
  const navigate = useNavigate();

  const classes = [
    { id: 'character-female', name: 'Lady Ember' },
    { id: 'character-male', name: 'Void Walker' }
  ];

  // --- BLANK SLATE DEFAULTS ---
  // Always default to New Cultivator (false) and an empty name string
  const [isLoginMode, setIsLoginMode] = useState(false); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); 
  const [errorMsg, setErrorMsg] = useState(''); 
  
  const [selectedClass, setSelectedClass] = useState(() => {
    const isValid = character && classes.some(c => c.id === character.classId);
    return isValid ? character.classId : classes[0].id;
  });

  const sectRoster = JSON.parse(localStorage.getItem('sectRoster')) || {};
  const isReturningUser = !!sectRoster[name];

  useEffect(() => {
    if (isLoginMode && isReturningUser) {
      setSelectedClass(sectRoster[name].classId);
      setErrorMsg(''); 
    }
  }, [name, isLoginMode, isReturningUser]);

  // --- STRICT TAB SWITCHING ---
  const handleModeSwitch = (mode) => {
    setIsLoginMode(mode);
    setErrorMsg('');
    setPassword(''); 
    setName(''); // Explicitly wipe the name field whenever they change tabs
  };

  const handleStart = () => {
    setErrorMsg('');

    if (!name) return setErrorMsg('You must enter a name to enter the Sect!');
    if (!password) return setErrorMsg('You must forge a Dao Seal (Password)!');

    const currentRoster = JSON.parse(localStorage.getItem('sectRoster')) || {};

    if (isLoginMode) {
      // --- EXPLICIT LOGIN LOGIC ---
      if (!currentRoster[name]) {
        return setErrorMsg('Cultivator not found. Please check your name or switch to New Cultivator mode.');
      }

      if (currentRoster[name].password === password) {
        setCharacter({ name, classId: currentRoster[name].classId });
        navigate('/dashboard');
      } else {
        setErrorMsg('Incorrect Dao Seal for this Cultivator.');
      }

    } else {
      // --- EXPLICIT REGISTRATION LOGIC ---
      if (currentRoster[name]) {
        return setErrorMsg('This name is already claimed! Please choose another name, or switch to Returning Cultivator if this is you.');
      }

      const isPasswordTaken = Object.values(currentRoster).some(user => user.password === password);
      if (isPasswordTaken) {
        return setErrorMsg('This Dao Seal is already claimed by another. Please choose a unique password!');
      }

      // Register the new user
      currentRoster[name] = {
        password: password,
        classId: selectedClass
      };
      localStorage.setItem('sectRoster', JSON.stringify(currentRoster));

      resetProgressForNewUser();
      setCharacter({ name, classId: selectedClass });
      navigate('/dashboard');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--accent-red)' }}>Forge Your Cultivator</h1>
      
      {/* --- THE MODE TOGGLE TABS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => handleModeSwitch(false)}
          className="btn-gothic"
          style={{ 
            background: !isLoginMode ? 'var(--accent-red)' : 'rgba(0,0,0,0.5)',
            color: !isLoginMode ? 'white' : 'var(--line-light)',
            flex: 1
          }}
        >
          New Cultivator
        </button>
        <button 
          onClick={() => handleModeSwitch(true)}
          className="btn-gothic"
          style={{ 
            background: isLoginMode ? 'var(--accent-red)' : 'rgba(0,0,0,0.5)',
            color: isLoginMode ? 'white' : 'var(--line-light)',
            flex: 1
          }}
        >
          Returning Cultivator
        </button>
      </div>

      <div className="character-stage" style={{ backgroundImage: "url('/assets/bg-sitting.jpg')" }}>
        <div className="character-rig stance-cave">
          <img src={`/assets/${selectedClass}-cave.png`} alt="class preview" />
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {errorMsg && (
          <div style={{ background: 'rgba(139,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '5px', border: '1px solid var(--accent-orange)' }}>
            {errorMsg}
          </div>
        )}

        <select 
          value={selectedClass} 
          onChange={e => setSelectedClass(e.target.value)} 
          className="btn-gothic"
          disabled={isLoginMode && isReturningUser}
          style={{ 
            padding: '10px', 
            fontSize: '1.2rem', 
            opacity: (isLoginMode && isReturningUser) ? 0.5 : 1, 
            cursor: (isLoginMode && isReturningUser) ? 'not-allowed' : 'pointer' 
          }}
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        
        <p style={{ margin: '-10px 0 0 0', fontSize: '0.8rem', color: 'var(--accent-orange)' }}>
          {isLoginMode 
            ? (isReturningUser ? "Cultivator Found: Class Locked." : "Enter your established name.")
            : "Choose your path and unique name."}
        </p>

        <input 
          placeholder="Enter Cultivator Name" 
          value={name} onChange={e => setName(e.target.value)}
          style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--line-light)', textAlign: 'center', fontSize: '1.2rem' }}
        />

        <input 
          type="password"
          placeholder="Enter Unique Dao Seal (Password)" 
          value={password} onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--accent-orange)', textAlign: 'center', fontSize: '1.2rem' }}
        />
        
        <button onClick={handleStart} className="btn-gothic" style={{background: 'var(--accent-red)', color: 'white', fontSize: '1.2rem', padding: '15px'}}>
          {isLoginMode ? "Resume Cultivation" : "Begin Ascension"}
        </button>
      </div>
    </div>
  );
};

export default CharacterCreator;