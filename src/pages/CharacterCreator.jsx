import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const CharacterCreator = () => {
  const { character, setCharacter, resetProgressForNewUser } = useContext(GameContext);
  const navigate = useNavigate();

  // The classes mapped to your Figma image prefixes with your new custom names!
  const classes = [
    { id: 'character-female', name: 'Lady Ember' },
    { id: 'character-male', name: 'Void Walker' }
  ];

  const [name, setName] = useState(character ? character.name : '');
  const [selectedClass, setSelectedClass] = useState(character ? character.classId : classes[0].id);

  const handleStart = () => {
    if (!name) return alert('Enter a cultivator name!');
    
    // Reset progress if it's a new user, OR if the name changed, OR if the class changed
    if (!character) {
      resetProgressForNewUser();
    } else if (character.name !== name || character.classId !== selectedClass) {
      resetProgressForNewUser();
    }

    // Save just the name and the class ID
    setCharacter({ name, classId: selectedClass });
    navigate('/dashboard');
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--accent-red)' }}>Forge Your Cultivator</h1>
      
      <div className="character-stage" style={{ backgroundImage: "url('/assets/bg-sitting.jpg')" }}>
        <div className="character-rig stance-cave">
          {/* Dynamically loads character-female-cave.png or character-male-cave.png */}
          <img src={`/assets/${selectedClass}-cave.png`} alt="class preview" />
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <select 
          value={selectedClass} 
          onChange={e => setSelectedClass(e.target.value)} 
          className="btn-gothic"
          style={{ padding: '10px', fontSize: '1.2rem' }}
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input 
          placeholder="Enter Unique Cultivator Name" 
          value={name} onChange={e => setName(e.target.value)}
          style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--line-light)', textAlign: 'center', fontSize: '1.2rem' }}
        />
        
        <button onClick={handleStart} className="btn-gothic" style={{background: 'var(--accent-red)', color: 'white', fontSize: '1.2rem', padding: '15px'}}>
          Enter your Path to Ascension
        </button>
      </div>
    </div>
  );
};

export default CharacterCreator;