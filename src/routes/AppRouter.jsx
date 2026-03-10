import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../views/AdminDashboard'; 
import AboutScreen from '../views/AboutScreen';

export const AppRouter = () => {
  return (
    <Routes>
     
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/about" element={<AboutScreen/>} />
    </Routes>
  );
};