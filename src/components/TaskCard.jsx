import React from 'react';

const TaskCard = ({ task, onBattle, onFlee }) => {
  
  // Xianxia Lore Dictionary for Threat Levels
  const threatLevels = {
    easy: "Minor Demon",
    medium: "Elite Fiend",
    hard: "Boss Battle"
  };

  // Color coding based on danger
  const threatColors = {
    easy: "var(--line-light)",      // Silver/White for easy
    medium: "var(--accent-orange)", // Orange for medium
    hard: "var(--accent-red)"       // Dark Red for hard
  };

  return (
    <div style={{ 
      borderLeft: `4px solid ${threatColors[task.difficulty]}`, 
      padding: '10px', 
      marginBottom: '10px', 
      background: 'rgba(0,0,0,0.5)',
      borderRadius: '0 4px 4px 0'
    }}>
      
      {/* Dynamic Title Bar */}
      <div style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.1rem', wordBreak: 'break-word', paddingRight: '10px' }}>
          {task.name}
        </span>
        
        {/* The Immersive Threat Badge */}
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

      {/* Action Buttons */}
      <div style={{ display: 'flex' }}>
        <button onClick={() => onBattle(task)} className="btn-gothic">Engage</button>
        
        {/* Note: I swapped var(--accent-grey) to var(--line-light) to match your main CSS variables! */}
        <button 
          onClick={() => onFlee(task.id)} 
          className="btn-gothic" 
          style={{ borderColor: 'var(--line-light)', color: 'var(--line-light)', marginLeft: '10px' }}
        >
          Flee
        </button>
      </div>
      
    </div>
  );
};

export default TaskCard;