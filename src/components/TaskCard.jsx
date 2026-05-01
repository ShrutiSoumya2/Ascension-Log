import React from 'react';

const TaskCard = ({ task, onBattle, onFlee }) => {
  return (
    <div style={{ borderLeft: '4px solid var(--accent-orange)', padding: '10px', marginBottom: '10px', background: 'rgba(0,0,0,0.5)' }}>
      <p style={{ margin: '0 0 10px 0' }}>{task.name} ({task.difficulty})</p>
      <button onClick={() => onBattle(task)} className="btn-gothic">Engage</button>
      <button onClick={() => onFlee(task.id)} className="btn-gothic" style={{ borderColor: 'var(--accent-grey)', color: 'var(--accent-grey)', marginLeft: '10px' }}>Flee</button>
    </div>
  );
};

export default TaskCard;