import React, { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [character, setCharacter] = useState(() => JSON.parse(localStorage.getItem('cultivator')) || null);
  const [level, setLevel] = useState(localStorage.getItem('level') || "Qi Condensation");
  const [xp, setXp] = useState(parseInt(localStorage.getItem('xp')) || 0);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [mood, setMood] = useState('mood-neutral.png');
  const [isBossPending, setIsBossPending] = useState(false);
  
  const [activeBattle, setActiveBattle] = useState(null); 
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('streak')) || 1);
  const [firstTaskDone, setFirstTaskDone] = useState(localStorage.getItem('firstTask') === 'true');
  const [enemiesDefeated, setEnemiesDefeated] = useState(parseInt(localStorage.getItem('enemiesDefeated')) || 0);
  
  const [notification, setNotification] = useState(null); 

  useEffect(() => {
    if (character) {
      localStorage.setItem('cultivator', JSON.stringify(character));
      localStorage.setItem('level', level);
      localStorage.setItem('xp', xp);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('streak', streak);
      localStorage.setItem('firstTask', firstTaskDone);
      localStorage.setItem('enemiesDefeated', enemiesDefeated);
    }
    
    if (xp >= 100 && level === "Qi Condensation") setIsBossPending(true);
    if (xp >= 300 && level === "Foundation Establishment") setIsBossPending(true);
  }, [character, level, xp, tasks, streak, firstTaskDone, enemiesDefeated]);

  const addTask = (task) => setTasks([...tasks, task]);
  
  const completeTask = (taskId, difficulty) => {
    const gainedXp = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
    setXp(prev => prev + gainedXp);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setEnemiesDefeated(prev => prev + 1);
    
    if (!firstTaskDone) {
      setFirstTaskDone(true);
      triggerNotification('sword', 'First Task Complete!');
    } else {
      triggerNotification('crown', 'Demon Slain!');
    }
    
    setActiveBattle(null); 
  };

  const abandonTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setActiveBattle(null);
  };

  const triggerNotification = (img, text) => {
    setNotification({ img, text });
    setTimeout(() => setNotification(null), 4000); 
  };

  const resetProgressForNewUser = () => {
    setLevel("Qi Condensation");
    setXp(0);
    setTasks([]);
    setStreak(1);
    setFirstTaskDone(false);
    setEnemiesDefeated(0);
    setActiveBattle(null);
  };

  return (
    <GameContext.Provider value={{
      character, setCharacter, level, setLevel, xp, setXp,
      tasks, addTask, completeTask, abandonTask, mood, setMood,
      isBossPending, setIsBossPending,
      activeBattle, setActiveBattle, streak, firstTaskDone, enemiesDefeated,
      notification, triggerNotification, resetProgressForNewUser
    }}>
      {children}
    </GameContext.Provider>
  );
};