
import { Routes, Route } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/editor/:projectId" element={<Editor />} />
      
      {/* Fallback for old URL while developing */}
      <Route path="/editor" element={<Editor />} /> 
    </Routes>
  );
}

export default App;
