import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import Appointments from './Appointments';
import Auth from './Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
