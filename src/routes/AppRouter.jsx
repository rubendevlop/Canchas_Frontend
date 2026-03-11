import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../views/AdminDashboard'; 
import LoginScreen from '../views/auth/LoginScreen';
import HomeScreen from '../views/HomeScreen';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};