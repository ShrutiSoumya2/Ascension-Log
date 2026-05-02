import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Intro from './pages/Intro';
import CharacterCreator from './pages/CharacterCreator';
import Dashboard from './pages/Dashboard';
import './index.css';
import CharacterProfile from './pages/CharacterProfile';
import Realms from './pages/Realms';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/creator" element={<CharacterCreator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<CharacterProfile />} />
          <Route path="/realms" element={<Realms />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;