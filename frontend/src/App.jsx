import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Authentication from './pages/authentication/authentication';

function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Authentication />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
    );
}

export default App;
