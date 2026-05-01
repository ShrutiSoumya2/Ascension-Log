import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Intro from './pages/Intro';
import CharacterCreator from './pages/CharacterCreator';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/creator" element={<CharacterCreator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;