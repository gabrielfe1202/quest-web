import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Level from './pages/Level';
import Login from './pages/Login';
import { Introduction } from './pages/Introduction';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Level/:id" element={<Level />} />
      <Route path="/Introduction" element={<Introduction />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  )
}

export default App
