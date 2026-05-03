import React from 'react';

const TaskCard = ({ task, onBattle, onFlee, isActive }) => {
  
  const threatLevels = {
    easy: "Minor Demon",
    medium: "Elite Fiend",
    hard: "Boss Battle"
  };

  const threatColors = {
    easy: "var(--line-light)",
    medium: "var(--accent-orange)",
    hard: "var(--accent-red)"
  };

  return (
    <div style={{ 
      borderLeft: `4px solid ${threatColors[task.difficulty]}`, 
      padding: '10px', 
      marginBottom: '10px', 
      // NEW: Dynamic background and scale based on isActive!
      background: isActive ? `radial-gradient(circle at left, rgba(139,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)` : 'rgba(0,0,0,0.5)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      border: isActive ? `1px solid ${threatColors[task.difficulty]}` : 'none',
      transition: 'all 0.3s ease',
      borderRadius: '0 4px 4px 0'
    }}>
      
      <div style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.1rem', wordBreak: 'break-word', paddingRight: '10px', color: isActive ? 'white' : 'var(--text-main)' }}>
          {task.name}
        </span>
        
        <span style={{ 
          fontSize: '0.8rem', 
          color: threatColors[task.difficulty],
          border: `1px solid ${threatColors[task.difficulty]}`,
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          whiteSpace: 'nowrap'
        }}>
          {threatLevels[task.difficulty]}
        </span>
      </div>

      <div style={{ display: 'flex' }}>
        {/* NEW: Dynamic Button Styling */}
        <button 
          onClick={() => onBattle(task)} 
          className="btn-gothic"
          style={{
            background: isActive ? 'var(--accent-red)' : 'rgba(0,0,0,0.6)',
            color: isActive ? 'white' : 'var(--accent-orange)',
            borderColor: isActive ? 'var(--accent-red)' : 'var(--line-light)'
          }}
        >
          {isActive ? "ENGAGED" : "ENGAGE"}
        </button>
        
        <button onClick={() => onFlee(task.id)} className="btn-gothic" style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)', marginLeft: '10px' }}>
          Flee
        </button>
      </div>
      
    </div>
  );
};

export default TaskCard;