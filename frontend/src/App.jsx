import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Authentication from './pages/authentication/authentication';
import Dashboard from './pages/dashboard/dashboard';
import VehicleRegistry from './pages/Vehicle Registry/vehicle';
import Drivers from './pages/Driver/driver';
import TripDispatcher from './pages/Trip/trip';
import Maintenance from './pages/maintenance/maintenance';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fleet" element={<VehicleRegistry />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/trips" element={<TripDispatcher />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
