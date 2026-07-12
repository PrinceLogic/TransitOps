import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Authentication from './pages/authentication/authentication';
import Dashboard from './pages/dashboard/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
