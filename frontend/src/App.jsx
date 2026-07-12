import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Authentication from './pages/authentication/authentication';
import Dashboard from './pages/dashboard/dashboard';
import VehicleRegistry from './pages/Vehicle Registry/vehicle';
import Drivers from './pages/Driver/driver';
import TripDispatcher from './pages/Trip/trip';
import Maintenance from './pages/maintenance/maintenance';
import Compliance from './pages/Compliance/compliance';
import Fuel from './pages/Fuel/fuel';
import Analytics from './pages/Analytics/analytics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/fleet" element={<ProtectedRoute><VehicleRegistry /></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><TripDispatcher /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
      <Route path="/fuel" element={<ProtectedRoute><Fuel /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
