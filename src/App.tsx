import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Level from './pages/Level';
import Login from './pages/Login';
import { Introduction } from './pages/Introduction';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Level/:id" element={<Level />} />
      <Route path="/Introduction" element={<Introduction />} />
    </Routes>
  )
}

export default App
