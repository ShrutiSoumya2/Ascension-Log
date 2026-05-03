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
  
  // --- STREAK LOGIC STATES ---
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('streak')) || 1);
  const [lastTaskDate, setLastTaskDate] = useState(localStorage.getItem('lastTaskDate') || null);

  const [firstTaskDone, setFirstTaskDone] = useState(localStorage.getItem('firstTask') === 'true');
  const [enemiesDefeated, setEnemiesDefeated] = useState(parseInt(localStorage.getItem('enemiesDefeated')) || 0);
  const [notification, setNotification] = useState(null); 

  const [hasSeenBossWarning, setHasSeenBossWarning] = useState(localStorage.getItem('hasSeenBossWarning') === 'true');
  const [insights, setInsights] = useState(() => JSON.parse(localStorage.getItem('insights')) || []);

  // --- GLOBAL TIMER STATES ---
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [timerActive, setTimerActive] = useState(false);

  // GLOBAL TIMER COUNTDOWN LOGIC
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

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
      localStorage.setItem('hasSeenBossWarning', hasSeenBossWarning);
      localStorage.setItem('insights', JSON.stringify(insights));
    }
    
    // REBALANCED XP THRESHOLDS
    if (xp >= 500 && level === "Qi Condensation") setPendingTribulation("Foundation Establishment");
    if (xp >= 1500 && level === "Foundation Establishment") setPendingTribulation("Core Formation");
    if (xp >= 3500 && level === "Core Formation") setPendingTribulation("Nascent Soul");
  }, [character, level, xp, tasks, streak, lastTaskDate, firstTaskDone, enemiesDefeated, hasSeenBossWarning, insights]);

  // 2. Check on load if the user missed a day and broke their streak
  useEffect(() => {
     if (lastTaskDate) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const lastTask = new Date(lastTaskDate);
        lastTask.setHours(0,0,0,0);
        
        const diffTime = Math.abs(today - lastTask);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays > 1) {
            setStreak(1);
        }
     }
  }, []);

  const addTask = (task) => setTasks([...tasks, task]);
  
  const completeTask = (taskId, difficulty) => {
    // --- UPDATED XP PROGRESSION ---
    // Scaled to require consistent cultivation to reach Foundation Establishment (500 XP)
    const gainedXp = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    
    setXp(prev => prev + gainedXp);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setEnemiesDefeated(prev => prev + 1);
    
    // --- 3. THE STREAK INCREMENT LOGIC ---
    const todayStr = new Date().toDateString();
    if (lastTaskDate !== todayStr) {
      if (lastTaskDate) {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         
         if (lastTaskDate === yesterday.toDateString()) {
             setStreak(prev => prev + 1); 
         } else {
             setStreak(1); 
         }
      }
      setLastTaskDate(todayStr);
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
    // Remove the task from the list
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // BUG FIX: If you flee the boss you are currently fighting, reset the arena AND the timer!
    if (activeBattle && activeBattle.id === taskId) {
      setActiveBattle(null);
      setTimerActive(false); // Stop the clock
      setTimeLeft(customMinutes * 60); // Reset the time back to full
    }
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
    setHasSeenBossWarning(false);
    setInsights([]); 
    
    // Reset timer for new user
    setTimerActive(false);
    setTimeLeft(1500);
    setCustomMinutes(25);
  };

  return (
    <GameContext.Provider value={{
      character, setCharacter, level, setLevel, xp, setXp,
      tasks, addTask, completeTask, abandonTask, mood, setMood,
      pendingTribulation, setPendingTribulation,
      activeBattle, setActiveBattle, streak, firstTaskDone, enemiesDefeated,
      notification, triggerNotification, resetProgressForNewUser,
      hasSeenBossWarning, setHasSeenBossWarning,
      insights, setInsights,
      // Exporting Timer States
      customMinutes, setCustomMinutes, timeLeft, setTimeLeft, timerActive, setTimerActive
    }}>
      {children}
    </GameContext.Provider>
  );
};