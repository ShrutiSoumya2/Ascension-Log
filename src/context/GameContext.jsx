import React, { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [character, setCharacter] = useState(() => JSON.parse(localStorage.getItem('cultivator')) || null);
  const [level, setLevel] = useState(localStorage.getItem('level') || "Qi Condensation");
  const [xp, setXp] = useState(parseInt(localStorage.getItem('xp')) || 0);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [mood, setMood] = useState('mood-neutral.png');
  
  const [pendingTribulation, setPendingTribulation] = useState(null); 
  const [activeBattle, setActiveBattle] = useState(null); 
  
  // --- NEW STREAK LOGIC STATES ---
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('streak')) || 1);
  const [lastTaskDate, setLastTaskDate] = useState(localStorage.getItem('lastTaskDate') || null);

  const [firstTaskDone, setFirstTaskDone] = useState(localStorage.getItem('firstTask') === 'true');
  const [enemiesDefeated, setEnemiesDefeated] = useState(parseInt(localStorage.getItem('enemiesDefeated')) || 0);
  const [notification, setNotification] = useState(null); 

  // --- NEW BOSS WARNING STATE ---
  const [hasSeenBossWarning, setHasSeenBossWarning] = useState(localStorage.getItem('hasSeenBossWarning') === 'true');

  // 1. Save everything to Local Storage
  useEffect(() => {
    if (character) {
      localStorage.setItem('cultivator', JSON.stringify(character));
      localStorage.setItem('level', level);
      localStorage.setItem('xp', xp);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('streak', streak);
      localStorage.setItem('lastTaskDate', lastTaskDate);
      localStorage.setItem('firstTask', firstTaskDone);
      localStorage.setItem('enemiesDefeated', enemiesDefeated);
      localStorage.setItem('hasSeenBossWarning', hasSeenBossWarning); // Saved!
    }
    
    // REBALANCED XP THRESHOLDS
    if (xp >= 500 && level === "Qi Condensation") setPendingTribulation("Foundation Establishment");
    if (xp >= 1500 && level === "Foundation Establishment") setPendingTribulation("Core Formation");
    if (xp >= 3500 && level === "Core Formation") setPendingTribulation("Nascent Soul");
  }, [character, level, xp, tasks, streak, lastTaskDate, firstTaskDone, enemiesDefeated, hasSeenBossWarning]);

  // 2. Check on load if the user missed a day and broke their streak
  useEffect(() => {
     if (lastTaskDate) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const lastTask = new Date(lastTaskDate);
        lastTask.setHours(0,0,0,0);
        
        const diffTime = Math.abs(today - lastTask);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        
        // If more than 1 day has passed since last task, reset streak to 1
        if (diffDays > 1) {
            setStreak(1);
        }
     }
  }, []);

  const addTask = (task) => setTasks([...tasks, task]);
  
  const completeTask = (taskId, difficulty) => {
    // Hard (Boss) gives a massive 100 XP due to the 25 min timer
    const gainedXp = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 30 : 100;
    setXp(prev => prev + gainedXp);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setEnemiesDefeated(prev => prev + 1);
    
    // --- 3. THE STREAK INCREMENT LOGIC ---
    const todayStr = new Date().toDateString();
    if (lastTaskDate !== todayStr) {
      if (lastTaskDate) {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         
         // If their last task was exactly yesterday, +1!
         if (lastTaskDate === yesterday.toDateString()) {
             setStreak(prev => prev + 1); 
         } else {
             // Otherwise, they missed a day, reset to 1
             setStreak(1); 
         }
      }
      setLastTaskDate(todayStr); // Log today as the most recent activity
    }

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
    setLastTaskDate(null);
    setFirstTaskDone(false);
    setEnemiesDefeated(0);
    setActiveBattle(null);
    setPendingTribulation(null);
    setHasSeenBossWarning(false); // Resets warning for a new cultivator
  };

  return (
    <GameContext.Provider value={{
      character, setCharacter, level, setLevel, xp, setXp,
      tasks, addTask, completeTask, abandonTask, mood, setMood,
      pendingTribulation, setPendingTribulation,
      activeBattle, setActiveBattle, streak, firstTaskDone, enemiesDefeated,
      notification, triggerNotification, resetProgressForNewUser,
      hasSeenBossWarning, setHasSeenBossWarning // Exported to Dashboard!
    }}>
      {children}
    </GameContext.Provider>
  );
};